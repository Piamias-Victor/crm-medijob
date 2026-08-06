import { prisma } from '@/server/db/repositories/client'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { badakanClientFromEnv, type BadakanClient } from '@/server/badakan/client'
import { importBadakanCvToBlob } from '@/server/app-profile/import-cv'
import { vercelBlobClient } from '@/server/services/blob'

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
}

export const defaultAppProfileDeps: AppProfileDeps = {
  listPending: () => appProfileRepository.listPending(),
  countPending: () => appProfileRepository.countPending(),
  findById: (id) => appProfileRepository.findById(id),
  findByBadakanIds: (ids) => appProfileRepository.findByBadakanIds(ids),
  upsertPending: (data) => appProfileRepository.upsertPending(data),
  markStatus: (id, status, candidateId) => appProfileRepository.markStatus(id, status, candidateId),
  createProfile: (input) => candidateRepository.createProfile(input),
  findJobTitleIdByName: async (name) => {
    const row = await prisma.jobTitle.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    })
    return row?.id ?? null
  },
  getBadakanClient: () => badakanClientFromEnv(),
  importCvUrl: (badakanId) => importBadakanCvToBlob(badakanId, vercelBlobClient),
}
