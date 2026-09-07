import type { BadakanRecipient } from '@/server/badakan/map-recipient'
import {
  identityPatchFromBadakan,
  type ExistingBadakanIdentity,
} from './merge-badakan-identity'
import type { SyncValidatedDeps } from './sync-validated.types'

export async function attachAppProfile(
  badakanId: string,
  candidateId: string,
  deps: SyncValidatedDeps,
) {
  const profile = await deps.findAppProfileByBadakanId(badakanId)
  if (!profile) return
  if (profile.status === 'EN_ATTENTE') await deps.markAppValidated(profile.id, candidateId)
  else if (!profile.candidateId) await deps.linkAppProfileCandidate(profile.id, candidateId)
}

export async function patchIdentityFromRow(
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

export async function resolveCreateJobTitleId(
  row: BadakanRecipient,
  fromComments: string | undefined,
  deps: SyncValidatedDeps,
) {
  const mapped = row.activityLabel ? await deps.mapJobTitleId(row.activityLabel) : null
  if (mapped) return mapped
  return fromComments ?? (await deps.resolveJobTitleId(row.activityLabel))
}
