import type { PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export function makeMissionRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.MissionCreateInput) => db.mission.create({ data }),
    findById: (id: string) =>
      db.mission.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.mission.findMany({ where: NOT_DELETED, orderBy: { createdAt: 'desc' } }),
    softDelete: (id: string) =>
      db.mission.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const missionRepository = makeMissionRepository()
