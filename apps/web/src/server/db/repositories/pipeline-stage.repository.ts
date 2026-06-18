import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makePipelineStageRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.PipelineStageCreateInput) =>
      db.pipelineStage.create({ data }),
    findById: (id: string) => db.pipelineStage.findUnique({ where: { id } }),
    list: () => db.pipelineStage.findMany({ orderBy: { position: 'asc' } }),
  }
}

export const pipelineStageRepository = makePipelineStageRepository()
