import type { Prisma } from '@prisma/client'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { AppProfileUpsertInput } from '@/server/db/repositories/app-profile.repository'
import type { LinkedAppCandidate } from './sync-validated.types'

export type InboxRevertDeps = {
  findAppProfileByBadakanId: SyncValidatedFindProfile
  restorePending: (profileId: string) => Promise<unknown>
  upsertInbox: (data: AppProfileUpsertInput) => Promise<unknown>
  softDeleteCandidate: (candidateId: string) => Promise<unknown>
  unlinkAppOrigin: (candidateId: string) => Promise<unknown>
}

type SyncValidatedFindProfile = (
  badakanId: string,
) => Promise<{ id: string; status: string; candidateId: string | null } | null>

function toInboxUpsert(row: BadakanRecipient): AppProfileUpsertInput {
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
    hasResume: row.hasResume,
    snapshot: row.snapshot as Prisma.InputJsonValue,
  }
}

export async function returnNotValidatedToInbox(
  row: BadakanRecipient,
  existing: LinkedAppCandidate | null,
  deps: InboxRevertDeps,
) {
  const profile = await deps.findAppProfileByBadakanId(row.badakanId)
  if (profile) await deps.restorePending(profile.id)
  else await deps.upsertInbox(toInboxUpsert(row))
  if (!existing) return
  if (existing.origin === 'APP') {
    await deps.softDeleteCandidate(existing.id)
    return
  }
  await deps.unlinkAppOrigin(existing.id)
}
