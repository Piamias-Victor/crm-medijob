import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { defaultAppProfileDeps } from '@/server/routers/app-profile.deps'
import { syncAppValidated } from '@/server/app-profile/sync-validated'
import { findAppValidatedMatch } from '@/server/app-profile/find-app-validated-match'
import type { SyncValidatedDeps } from '@/server/app-profile/sync-validated.types'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export function defaultSyncValidatedDeps(): SyncValidatedDeps {
  return {
    findByBadakanId: candidateRepository.findByBadakanId,
    findMatch: (probe) =>
      findAppValidatedMatch(probe, {
        findIdentityByEmail: candidateRepository.findIdentityByEmail,
        findIdentityByPhone: candidateRepository.findIdentityByPhoneAny,
      }),
    createAppCandidate: candidateRepository.createAppCandidate,
    linkAppOrigin: candidateRepository.linkAppOrigin,
    findAppProfileByBadakanId: appProfileRepository.findByBadakanId,
    markAppValidated: (id, candidateId) =>
      appProfileRepository.markStatus(id, 'APP_VALIDATED', candidateId),
    resolveJobTitleId: async (label) => {
      if (label) {
        const mapped = await defaultAppProfileDeps.findJobTitleIdByName(label)
        if (mapped) return mapped
      }
      const titles = await jobTitleRepository.list()
      return titles[0]?.id ?? null
    },
  }
}

export function syncValidatedEmployees(rows: BadakanRecipient[]) {
  return syncAppValidated(rows, defaultSyncValidatedDeps())
}
