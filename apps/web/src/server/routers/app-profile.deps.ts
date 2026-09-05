import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { badakanClientFromEnv, type BadakanClient } from '@/server/badakan/client'
import { importBadakanCvToBlob } from '@/server/app-profile/import-cv'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
import { runAppValidatedTest, type TestOneReport } from '@/server/app-profile/test-one'
import { defaultTestOneDeps } from '@/server/app-profile/test-one.deps'

export type AppProfileDeps = {
  listPending: typeof appProfileRepository.listPending
  countPending: typeof appProfileRepository.countPending
  findById: typeof appProfileRepository.findById
  findByBadakanIds: typeof appProfileRepository.findByBadakanIds
  upsertPending: typeof appProfileRepository.upsertPending
  markStatus: typeof appProfileRepository.markStatus
  createProfile: typeof candidateRepository.createProfile
  findJobTitleIdByName: (name: string) => Promise<string | null>
  getBadakanClient: () => BadakanClient
  importCvUrl: (badakanId: string) => Promise<string | null>
  runTestProcess: (badakanId: string) => Promise<TestOneReport>
}

export const defaultAppProfileDeps: AppProfileDeps = {
  listPending: () => appProfileRepository.listPending(),
  countPending: () => appProfileRepository.countPending(),
  findById: (id) => appProfileRepository.findById(id),
  findByBadakanIds: (ids) => appProfileRepository.findByBadakanIds(ids),
  upsertPending: (data) => appProfileRepository.upsertPending(data),
  markStatus: (id, status, candidateId) => appProfileRepository.markStatus(id, status, candidateId),
  createProfile: (input) => candidateRepository.createProfile(input),
  findJobTitleIdByName: (name) => jobTitleRepository.findIdByNameInsensitive(name),
  getBadakanClient: () => badakanClientFromEnv(),
  importCvUrl: (badakanId) => importBadakanCvToBlob(badakanId, resolveBlobClient()),
  runTestProcess: (badakanId) => runAppValidatedTest(badakanId, defaultTestOneDeps()),
}
