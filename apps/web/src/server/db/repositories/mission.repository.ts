import type { MissionStatus, PrismaClient, Prisma } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { missionDetailSelect } from './mission.repository.selects'
import { missionMatchingSelect, type MissionMatchingRow } from './mission-matching.select'

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
    findDetailById: (id: string) =>
      db.mission.findFirst({ where: { id, ...NOT_DELETED }, select: missionDetailSelect }),
    findForMatching: (id: string): Promise<MissionMatchingRow | null> =>
      db.mission.findFirst({ where: { id, ...NOT_DELETED }, select: missionMatchingSelect }),
    update: (id: string, data: Prisma.MissionUncheckedUpdateInput) =>
      db.mission.update({ where: { id }, data }),
    findForContext: (id: string) =>
      db.mission.findFirst({
        where: { id, ...NOT_DELETED },
        select: {
          title: true,
          contractType: true,
          startDate: true,
          salaireMin: true,
          salaireMax: true,
          notes: true,
        },
      }),
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.mission.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        select: listSelect,
        take: limit,
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
    createQuick: (data: Prisma.MissionUncheckedCreateInput) =>
      db.mission.create({
        data: { ...data, status: 'A_POURVOIR' },
        select: { id: true, status: true },
      }),
    listByContact: (contactId: string, limit = DEFAULT_LIST_LIMIT) =>
      db.mission.findMany({
        where: { contactId, ...NOT_DELETED },
        select: { id: true, title: true, status: true, pharmacy: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
  }
}

export const missionRepository = makeMissionRepository()
