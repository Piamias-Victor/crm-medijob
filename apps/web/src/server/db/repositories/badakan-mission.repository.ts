import type { Prisma, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import type { BadakanMission } from '@/server/badakan/map-mission'

const includeApplied = { searchApplied: true } as const

function persistFields(data: BadakanMission) {
  return {
    badakanId: data.badakanId,
    pharmacyName: data.pharmacyName,
    enterpriseId: data.enterpriseId,
    step: data.step,
    periods: data.periods as Prisma.InputJsonValue,
    syncedAt: new Date(),
  }
}

export function makeBadakanMissionRepository(db: PrismaClient = defaultDb) {
  return {
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        take: limit,
        include: includeApplied,
      }),
    findById: (id: string) =>
      db.badakanMission.findUnique({ where: { id }, include: includeApplied }),
    listEnterpriseIds: async () => {
      const rows = await db.badakanMission.findMany({
        where: { enterpriseId: { not: null } },
        select: { enterpriseId: true },
        distinct: ['enterpriseId'],
      })
      return rows.flatMap((row) => (row.enterpriseId ? [row.enterpriseId] : []))
    },
    upsertFromRead: (data: BadakanMission) =>
      db.badakanMission.upsert({
        where: { badakanId: data.badakanId },
        create: {
          ...persistFields(data),
          searchApplied: { create: data.searchApplied },
        },
        update: {
          ...persistFields(data),
          searchApplied: { deleteMany: {}, create: data.searchApplied },
        },
      }),
  }
}

export const badakanMissionRepository = makeBadakanMissionRepository()
