import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import type { BadakanMissionToPersist } from '@/server/badakan-mission/sync'
import { isOpenNeed } from '@/view-models/badakan-need'
import { includeApplied, includeReferentials } from './badakan-mission-persist'
import { upsertBadakanMissionWithStaffedStamp } from './badakan-mission-staffed-stamp'

export function makeBadakanMissionRepository(db: PrismaClient = defaultDb) {
  return {
    list: (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        take: limit,
        include: includeApplied,
      }),
    listOpenNeeds: async (limit = DEFAULT_LIST_LIMIT) => {
      const rows = await db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        include: {
          ...includeReferentials,
          proposals: { select: { status: true } },
        },
      })
      return rows.filter(isOpenNeed).slice(0, limit)
    },
    listForSuivi: async (limit = DEFAULT_LIST_LIMIT) =>
      db.badakanMission.findMany({
        orderBy: { syncedAt: 'desc' },
        take: limit,
        include: {
          ...includeReferentials,
          proposals: { select: { status: true, amountHt: true } },
        },
      }),
    findById: (id: string) =>
      db.badakanMission.findUnique({
        where: { id },
        include: {
          ...includeApplied,
          ...includeReferentials,
        },
      }),
    listEnterpriseIds: async () => {
      const rows = await db.badakanMission.findMany({
        where: { enterpriseId: { not: null } },
        select: { enterpriseId: true },
        distinct: ['enterpriseId'],
      })
      return rows.flatMap((row) => (row.enterpriseId ? [row.enterpriseId] : []))
    },
    upsertFromRead: (data: BadakanMissionToPersist) =>
      upsertBadakanMissionWithStaffedStamp(db, data),
  }
}

export const badakanMissionRepository = makeBadakanMissionRepository()
