import type { AppProfileStatus, Prisma } from '@prisma/client'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { AppProfileUpsertInput } from '@/server/db/repositories/app-profile.repository'

export type SyncDeps = {
  searchNewEmployees: () => Promise<BadakanRecipient[]>
  findByBadakanIds: (
    ids: string[],
  ) => Promise<Array<{ badakanId: string; status: AppProfileStatus }>>
  upsertPending: (data: AppProfileUpsertInput) => Promise<unknown>
  findJobTitleIdByName: (name: string) => Promise<string | null>
}

export type SyncResult = { fetched: number; upserted: number; skippedTreated: number }

function toUpsert(row: BadakanRecipient, jobTitleId: string | null): AppProfileUpsertInput {
  return {
    badakanId: row.badakanId,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postalCode,
    activityLabel: row.activityLabel,
    jobTitleId,
    hasResume: row.hasResume,
    snapshot: row.snapshot as Prisma.InputJsonValue,
  }
}

export async function syncAppProfiles(deps: SyncDeps): Promise<SyncResult> {
  const fetched = await deps.searchNewEmployees()
  const existing = await deps.findByBadakanIds(fetched.map((r) => r.badakanId))
  const treated = new Set(
    existing.filter((e) => e.status !== 'EN_ATTENTE').map((e) => e.badakanId),
  )
  let upserted = 0
  let skippedTreated = 0
  for (const row of fetched) {
    if (treated.has(row.badakanId)) {
      skippedTreated += 1
      continue
    }
    const jobTitleId = row.activityLabel
      ? await deps.findJobTitleIdByName(row.activityLabel)
      : null
    await deps.upsertPending(toUpsert(row, jobTitleId))
    upserted += 1
  }
  return { fetched: fetched.length, upserted, skippedTreated }
}
