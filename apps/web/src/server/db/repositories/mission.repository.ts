import type { MissionStatus, PrismaClient, Prisma } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

const listSelect = {
  id: true,
  title: true,
  status: true,
  startDate: true,
  jobTitle: { select: { name: true } },
  pharmacy: { select: { name: true, city: true } },
  referent: { select: { name: true } },
} as const

export function makeMissionRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: Prisma.MissionCreateInput) => db.mission.create({ data }),
    findById: (id: string) =>
      db.mission.findFirst({ where: { id, ...NOT_DELETED } }),
    list: () =>
      db.mission.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        select: listSelect,
      }),
    updateStatus: (id: string, status: MissionStatus) =>
      db.mission.update({ where: { id }, data: { status }, select: { id: true, status: true } }),
    search: (term: string, limit = 8) =>
      db.mission.findMany({
        where: { ...NOT_DELETED, title: { contains: term, mode: 'insensitive' } },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    softDelete: (id: string) =>
      db.mission.update({ where: { id }, data: { deletedAt: new Date() } }),
  }
}

export const missionRepository = makeMissionRepository()
