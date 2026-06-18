import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeJobTitleRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.JobTitleCreateInput) => db.jobTitle.create({ data }),
    findById: (id: string) => db.jobTitle.findUnique({ where: { id } }),
    list: () => db.jobTitle.findMany({ orderBy: { name: 'asc' } }),
    listCompatibleCandidateTitles: (missionJobTitleId: string) =>
      db.jobTitleCompatibility.findMany({ where: { missionJobTitleId } }),
  }
}

export const jobTitleRepository = makeJobTitleRepository()
