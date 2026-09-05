import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { defaultAppProfileDeps } from '@/server/routers/app-profile.deps'
import { syncAppValidated } from '@/server/app-profile/sync-validated'
import { findAppValidatedMatch } from '@/server/app-profile/find-app-validated-match'
import { syncCandidateDossier } from '@/server/app-profile/apply-dossier.deps'
import type { SyncValidatedDeps } from '@/server/app-profile/sync-validated.types'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export function defaultSyncValidatedDeps(): SyncValidatedDeps {
  const mapJobTitleId = (label: string) =>
    defaultAppProfileDeps.findJobTitleIdByName(label)
  return {
    findByBadakanId: candidateRepository.findByBadakanId,
    applyLifecycle: candidateRepository.applyAppLifecycle,
    findMatch: (probe) =>
      findAppValidatedMatch(probe, {
        findIdentityByEmail: candidateRepository.findIdentityByEmail,
        findIdentityByPhone: candidateRepository.findIdentityByPhoneAny,
      }),
    createAppCandidate: candidateRepository.createAppCandidate,
    linkAppOrigin: candidateRepository.linkAppOrigin,
    patchIdentity: candidateRepository.patchAppIdentity,
    findAppProfileByBadakanId: appProfileRepository.findByBadakanId,
    markAppValidated: (id, candidateId) =>
      appProfileRepository.markStatus(id, 'APP_VALIDATED', candidateId),
    resolveJobTitleId: async (label) => {
      if (label) {
        const mapped = await mapJobTitleId(label)
        if (mapped) return mapped
      }
      const titles = await jobTitleRepository.list()
      return titles[0]?.id ?? null
    },
    mapJobTitleId,
    syncDossier: syncCandidateDossier,
  }
}

export function syncValidatedEmployees(rows: BadakanRecipient[]) {
  return syncAppValidated(rows, defaultSyncValidatedDeps())
}
