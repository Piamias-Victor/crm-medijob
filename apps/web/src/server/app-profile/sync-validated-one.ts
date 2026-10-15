import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import { inactivateIfSuspended, restoreIfCompleted } from './sync-validated-lifecycle'
import {
  attachAppProfile,
  patchIdentityFromRow,
  resolveCreateJobTitleId,
} from './sync-validated-row'
import type { SyncValidatedDeps, SyncValidatedResult } from './sync-validated.types'

export async function syncOneValidated(
  row: BadakanRecipient,
  deps: SyncValidatedDeps,
  result: SyncValidatedResult,
  heavy: number,
  heavyLimit: number,
): Promise<boolean> {
  if (await inactivateIfSuspended(row, deps)) {
    result.skipped += 1
    return false
  }
  const existing = await deps.findByBadakanId(row.badakanId)
  if (existing) {
    await restoreIfCompleted(existing, deps)
    if (row.isValid && !existing.badakanValidatedAt) {
      await deps.markBadakanValidated(existing.id)
    }
    await patchIdentityFromRow(row, existing.id, deps, existing)
    await attachAppProfile(row.badakanId, existing.id, deps, row.isValid)
    result.skipped += 1
    return false
  }
  if (heavy >= heavyLimit) {
    result.skipped += 1
    return false
  }
  return convertNewRow(row, deps, result)
}

async function convertNewRow(
  row: BadakanRecipient,
  deps: SyncValidatedDeps,
  result: SyncValidatedResult,
) {
  const match = await deps.findMatch({
    email: row.email,
    phone: row.phone,
    firstName: row.firstName,
    lastName: row.lastName,
  })
  if (match) {
    await deps.linkAppOrigin(match.id, row.badakanId)
    if (row.isValid) await deps.markBadakanValidated(match.id)
    await patchIdentityFromRow(row, match.id, deps, match)
    await attachAppProfile(row.badakanId, match.id, deps, row.isValid)
    await deps.syncDossier(match.id, row.badakanId)
    result.linked += 1
    return true
  }
  const jobTitleId = await resolveCreateJobTitleId(row, undefined, deps)
  const intake = jobTitleId ? {} : await deps.enrichFromComments(row.badakanId)
  const resolved =
    jobTitleId ?? intake.jobTitleId ?? (await deps.resolveJobTitleId(row.activityLabel))
  if (!resolved) {
    result.skipped += 1
    return false
  }
  const created = await deps.createAppCandidate({
    ...intake,
    firstName: row.firstName,
    lastName: row.lastName,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    postalCode: row.postalCode,
    jobTitleId: resolved,
    origin: 'APP',
    status: 'NOUVEAU',
    badakanId: row.badakanId,
  })
  await attachAppProfile(row.badakanId, created.id, deps, row.isValid)
  if (row.isValid) await deps.markBadakanValidated(created.id)
  await deps.syncDossier(created.id, row.badakanId)
  result.created += 1
  return true
}
