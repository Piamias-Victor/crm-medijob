import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { syncAppValidated } from '@/server/app-profile/sync-validated'
import { findAppValidatedMatch } from '@/server/app-profile/find-app-validated-match'
import { syncCandidateDossier } from '@/server/app-profile/apply-dossier.deps'
import { enrichAppCandidateFromComments } from '@/server/app-profile/enrich-from-comments.deps'
import { returnNotValidatedToInbox } from '@/server/app-profile/sync-validated-inbox'
import {
  jobTitleIdForAppCreate,
  jobTitleIdFromActivity,
} from '@/server/app-profile/job-title-from-activity'
import type { SyncValidatedDeps } from '@/server/app-profile/sync-validated.types'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export function defaultSyncValidatedDeps(): SyncValidatedDeps {
  const listTitles = () => jobTitleRepository.list()
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
    linkAppProfileCandidate: appProfileRepository.linkCandidate,
    resolveJobTitleId: async (label) => jobTitleIdForAppCreate(label, await listTitles()),
    mapJobTitleId: async (label) => jobTitleIdFromActivity(label, await listTitles()),
    syncDossier: syncCandidateDossier,
    enrichFromComments: enrichAppCandidateFromComments,
    returnToInbox: (row, existing) =>
      returnNotValidatedToInbox(row, existing, {
        findAppProfileByBadakanId: appProfileRepository.findByBadakanId,
        restorePending: appProfileRepository.restorePending,
        upsertInbox: appProfileRepository.upsertPending,
        softDeleteCandidate: candidateRepository.softDelete,
        unlinkAppOrigin: candidateRepository.unlinkAppOrigin,
      }),
  }
}

export function syncValidatedEmployees(rows: BadakanRecipient[]) {
  return syncAppValidated(rows, defaultSyncValidatedDeps())
}
