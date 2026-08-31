import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import type { SyncValidatedDeps, SyncValidatedResult } from './sync-validated.types'

async function leaveInboxIfPending(
  badakanId: string,
  candidateId: string,
  deps: SyncValidatedDeps,
) {
  const profile = await deps.findAppProfileByBadakanId(badakanId)
  if (profile?.status !== 'EN_ATTENTE') return
  await deps.markAppValidated(profile.id, candidateId)
}

export async function syncAppValidated(
  rows: BadakanRecipient[],
  deps: SyncValidatedDeps,
): Promise<SyncValidatedResult> {
  const result: SyncValidatedResult = { created: 0, linked: 0, skipped: 0 }
  for (const row of rows) {
    const existing = await deps.findByBadakanId(row.badakanId)
    if (existing) {
      await leaveInboxIfPending(row.badakanId, existing.id, deps)
      result.skipped += 1
      continue
    }
    const match = await deps.findMatch({
      email: row.email,
      phone: row.phone,
      firstName: row.firstName,
      lastName: row.lastName,
    })
    if (match) {
      await deps.linkAppOrigin(match.id, row.badakanId)
      await leaveInboxIfPending(row.badakanId, match.id, deps)
      result.linked += 1
      continue
    }
    const jobTitleId = await deps.resolveJobTitleId(row.activityLabel)
    if (!jobTitleId) {
      result.skipped += 1
      continue
    }
    const created = await deps.createAppCandidate({
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      phone: row.phone,
      address: row.address,
      city: row.city,
      postalCode: row.postalCode,
      jobTitleId,
      origin: 'APP',
      status: 'NOUVEAU',
      badakanId: row.badakanId,
    })
    await leaveInboxIfPending(row.badakanId, created.id, deps)
    result.created += 1
  }
  return result
}
