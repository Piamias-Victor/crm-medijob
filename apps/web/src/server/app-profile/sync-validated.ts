import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import { identityPatchFromBadakan } from './merge-badakan-identity'
import { inactivateIfSuspended, restoreIfCompleted } from './sync-validated-lifecycle'
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

async function patchIdentityFromRow(
  row: BadakanRecipient,
  candidateId: string,
  deps: SyncValidatedDeps,
) {
  const jobTitleId = row.activityLabel
    ? await deps.mapJobTitleId(row.activityLabel)
    : null
  const patch = identityPatchFromBadakan(row, jobTitleId)
  if (Object.keys(patch).length === 0) return
  await deps.patchIdentity(candidateId, patch)
}

export async function syncAppValidated(
  rows: BadakanRecipient[],
  deps: SyncValidatedDeps,
): Promise<SyncValidatedResult> {
  const result: SyncValidatedResult = { created: 0, linked: 0, skipped: 0 }
  for (const row of rows) {
    if (await inactivateIfSuspended(row, deps)) {
      result.skipped += 1
      continue
    }
    const existing = await deps.findByBadakanId(row.badakanId)
    if (existing) {
      await restoreIfCompleted(existing, deps)
      await patchIdentityFromRow(row, existing.id, deps)
      await leaveInboxIfPending(row.badakanId, existing.id, deps)
      await deps.syncDossier(existing.id, row.badakanId)
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
      await patchIdentityFromRow(row, match.id, deps)
      await leaveInboxIfPending(row.badakanId, match.id, deps)
      await deps.syncDossier(match.id, row.badakanId)
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
    await deps.syncDossier(created.id, row.badakanId)
    result.created += 1
  }
  return result
}
