import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeJobTitleRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.JobTitleCreateInput) => db.jobTitle.create({ data }),
    findById: (id: string) => db.jobTitle.findUnique({ where: { id } }),
    list: () => db.jobTitle.findMany({ orderBy: { name: 'asc' } }),
    update: (id: string, data: Prisma.JobTitleUpdateInput) =>
      db.jobTitle.update({ where: { id }, data }),
    remove: (id: string) => db.jobTitle.delete({ where: { id } }),
    usageCount: async (id: string) =>
      (await db.candidate.count({ where: { jobTitleId: id } })) +
      (await db.mission.count({ where: { jobTitleId: id } })),
    listCompatibilities: () => db.jobTitleCompatibility.findMany(),
    listCompatibleCandidateTitles: (missionJobTitleId: string) =>
      db.jobTitleCompatibility.findMany({ where: { missionJobTitleId } }),
    setCompatibilityScore: async (
      missionJobTitleId: string,
      candidateJobTitleId: string,
      score: number,
    ) => {
      if (score === 0) {
        await db.jobTitleCompatibility.deleteMany({
          where: { missionJobTitleId, candidateJobTitleId },
        })
        return
      }
      await db.jobTitleCompatibility.upsert({
        where: {
          missionJobTitleId_candidateJobTitleId: {
            missionJobTitleId,
            candidateJobTitleId,
          },
        },
        update: { score },
        create: { missionJobTitleId, candidateJobTitleId, score },
      })
    },
  }
}

export const jobTitleRepository = makeJobTitleRepository()
