import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import { jobTitleIdForAppCreate } from '@/server/app-profile/job-title-from-activity'
import { resolveSyncroUserName } from './syncro-import-user'
import type { SyncroImportDeps } from './syncro-import.types'

export async function defaultSyncroImportDeps(): Promise<SyncroImportDeps> {
  const [jobTitles, recruiters] = await Promise.all([
    jobTitleRepository.list(),
    userRepository.listRecruiters(),
  ])
  return {
    findByBadakanId: appProfileRepository.findByBadakanId,
    upsertPending: appProfileRepository.upsertPending,
    updateIntake: (id, data) => appProfileRepository.updateIntake(id, data),
    markStatus: (id, status, candidateId) =>
      appProfileRepository.markStatus(id, status, candidateId),
    resolveUserIdByName: async (name) => resolveSyncroUserName(name, recruiters),
    findJobTitleIdByName: async (name) => jobTitleIdForAppCreate(name, jobTitles),
    createAppCandidate: (data) => candidateRepository.createAppCandidate(data),
    linkCandidate: (profileId, candidateId) =>
      appProfileRepository.linkCandidate(profileId, candidateId),
    findCandidateByBadakanId: async (badakanId) => {
      const row = await candidateRepository.findByBadakanId(badakanId)
      return row ? { id: row.id } : null
    },
  }
}
