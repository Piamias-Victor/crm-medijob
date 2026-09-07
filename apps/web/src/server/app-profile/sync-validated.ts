import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import { APP_CONVERT_BATCH_LIMIT } from './convert-batch'
import { inactivateIfSuspended, restoreIfCompleted } from './sync-validated-lifecycle'
import {
  attachAppProfile,
  patchIdentityFromRow,
  resolveCreateJobTitleId,
} from './sync-validated-row'
import type { SyncValidatedDeps, SyncValidatedResult } from './sync-validated.types'

export async function syncAppValidated(
  rows: BadakanRecipient[],
  deps: SyncValidatedDeps,
  heavyLimit = APP_CONVERT_BATCH_LIMIT,
): Promise<SyncValidatedResult> {
  const result: SyncValidatedResult = { created: 0, linked: 0, skipped: 0 }
  let heavy = 0
  for (const row of rows) {
    if (await inactivateIfSuspended(row, deps)) {
      result.skipped += 1
      continue
    }
    const existing = await deps.findByBadakanId(row.badakanId)
    if (existing) {
      await restoreIfCompleted(existing, deps)
      if (row.isValid && !existing.badakanValidatedAt) {
        await deps.markBadakanValidated(existing.id)
      }
      await patchIdentityFromRow(row, existing.id, deps, existing)
      await attachAppProfile(row.badakanId, existing.id, deps)
      result.skipped += 1
      continue
    }
    if (heavy >= heavyLimit) {
      result.skipped += 1
      continue
    }
    const handled = await convertNewRow(row, deps, result)
    if (handled) heavy += 1
  }
  return result
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
    await attachAppProfile(row.badakanId, match.id, deps)
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
  await attachAppProfile(row.badakanId, created.id, deps)
  if (row.isValid) await deps.markBadakanValidated(created.id)
  await deps.syncDossier(created.id, row.badakanId)
  result.created += 1
  return true
}
