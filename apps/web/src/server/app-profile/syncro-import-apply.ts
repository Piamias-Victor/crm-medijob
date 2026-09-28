import type { SyncroImportMapped } from '@/view-models/syncro-import.types'
import { intakePatch } from './syncro-import-patch'
import type { SyncroImportDeps, SyncroImportProfile } from './syncro-import.types'

async function resolveUsers(mapped: SyncroImportMapped, deps: SyncroImportDeps) {
  const referentId = mapped.referentName
    ? await deps.resolveUserIdByName(mapped.referentName)
    : null
  const lastCalledById = mapped.lastCalledByName
    ? await deps.resolveUserIdByName(mapped.lastCalledByName)
    : null
  return { referentId, lastCalledById }
}

async function ensureCandidate(
  mapped: SyncroImportMapped,
  deps: SyncroImportDeps,
  profileId: string,
  candidateId: string | null,
): Promise<string | null> {
  if (candidateId) return candidateId
  const existing = await deps.findCandidateByBadakanId(mapped.badakanId)
  if (existing) {
    await deps.linkCandidate(profileId, existing.id)
    return existing.id
  }
  const jobTitleId = mapped.activityLabel
    ? await deps.findJobTitleIdByName(mapped.activityLabel)
    : null
  if (!jobTitleId) return null
  const created = await deps.createAppCandidate({
    firstName: mapped.firstName,
    lastName: mapped.lastName,
    email: mapped.email,
    phone: mapped.phone,
    address: mapped.address,
    city: mapped.city,
    postalCode: mapped.postalCode,
    jobTitleId,
    badakanId: mapped.badakanId,
    origin: 'APP',
    status: 'NOUVEAU',
  })
  await deps.linkCandidate(profileId, created.id)
  return created.id
}

export async function applySyncroMapped(
  mapped: SyncroImportMapped,
  deps: SyncroImportDeps,
  existing: SyncroImportProfile | null,
): Promise<boolean> {
  const users = await resolveUsers(mapped, deps)
  const jobTitleId = mapped.activityLabel
    ? await deps.findJobTitleIdByName(mapped.activityLabel)
    : null
  const profile =
    existing ??
    (await deps.upsertPending({
      badakanId: mapped.badakanId,
      firstName: mapped.firstName,
      lastName: mapped.lastName,
      email: mapped.email,
      phone: mapped.phone,
      address: mapped.address,
      city: mapped.city,
      postalCode: mapped.postalCode,
      activityLabel: mapped.activityLabel,
      jobTitleId,
      relanceAt: mapped.relanceAt ?? undefined,
      muteOutbound: true,
    }))
  await deps.muteOutbound(profile.id)
  const candidateId = await ensureCandidate(
    mapped,
    deps,
    profile.id,
    existing?.candidateId ?? null,
  )
  await deps.updateIntake(profile.id, intakePatch(mapped, users.referentId, users.lastCalledById))
  if (mapped.profileStatus === 'IGNORE' || mapped.profileStatus === 'APP_VALIDATED') {
    await deps.markStatus(profile.id, mapped.profileStatus, candidateId)
  }
  return true
}
