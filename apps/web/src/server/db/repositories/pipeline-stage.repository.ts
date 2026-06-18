import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import type { PositionUpdate } from '@/server/admin/reorder'

export function makePipelineStageRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.PipelineStageCreateInput) =>
      db.pipelineStage.create({ data }),
    findById: (id: string) => db.pipelineStage.findUnique({ where: { id } }),
    list: () => db.pipelineStage.findMany({ orderBy: { position: 'asc' } }),
    update: (id: string, data: Prisma.PipelineStageUpdateInput) =>
      db.pipelineStage.update({ where: { id }, data }),
    remove: (id: string) => db.pipelineStage.delete({ where: { id } }),
    usageCount: (id: string) =>
      db.missionCandidate.count({ where: { stageId: id } }),
    reorder: (updates: PositionUpdate[]) =>
      db.$transaction(
        updates.map((u) =>
          db.pipelineStage.update({
            where: { id: u.id },
            data: { position: u.position },
          }),
        ),
      ),
  }
}

export const pipelineStageRepository = makePipelineStageRepository()
