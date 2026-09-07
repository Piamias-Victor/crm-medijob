import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import {
  identityPatchFromBadakan,
  type ExistingBadakanIdentity,
} from './merge-badakan-identity'
import { inactivateIfSuspended, restoreIfCompleted } from './sync-validated-lifecycle'
import type { SyncValidatedDeps, SyncValidatedResult } from './sync-validated.types'

async function attachAppProfile(badakanId: string, candidateId: string, deps: SyncValidatedDeps) {
  const profile = await deps.findAppProfileByBadakanId(badakanId)
  if (!profile) return
  if (profile.status === 'EN_ATTENTE') await deps.markAppValidated(profile.id, candidateId)
  else if (!profile.candidateId) await deps.linkAppProfileCandidate(profile.id, candidateId)
}

async function patchIdentityFromRow(
  row: BadakanRecipient,
  candidateId: string,
  deps: SyncValidatedDeps,
  existing?: ExistingBadakanIdentity | null,
) {
  const jobTitleId = row.activityLabel
    ? await deps.mapJobTitleId(row.activityLabel)
    : null
  const patch = identityPatchFromBadakan(row, jobTitleId, existing)
  if (Object.keys(patch).length === 0) return
  await deps.patchIdentity(candidateId, patch)
}

async function resolveCreateJobTitleId(
  row: BadakanRecipient,
  fromComments: string | undefined,
  deps: SyncValidatedDeps,
) {
  const mapped = row.activityLabel ? await deps.mapJobTitleId(row.activityLabel) : null
  if (mapped) return mapped
  return fromComments ?? (await deps.resolveJobTitleId(row.activityLabel))
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
      if (row.isValid && !existing.badakanValidatedAt) {
        await deps.markBadakanValidated(existing.id)
      }
      await patchIdentityFromRow(row, existing.id, deps, existing)
      await attachAppProfile(row.badakanId, existing.id, deps)
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
      if (row.isValid) await deps.markBadakanValidated(match.id)
      await patchIdentityFromRow(row, match.id, deps, match)
      await attachAppProfile(row.badakanId, match.id, deps)
      await deps.syncDossier(match.id, row.badakanId)
      result.linked += 1
      continue
    }
    const jobTitleId = await resolveCreateJobTitleId(row, undefined, deps)
    const intake = jobTitleId
      ? {}
      : await deps.enrichFromComments(row.badakanId)
    const resolved =
      jobTitleId ?? intake.jobTitleId ?? (await deps.resolveJobTitleId(row.activityLabel))
    if (!resolved) {
      result.skipped += 1
      continue
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
  }
  return result
}
