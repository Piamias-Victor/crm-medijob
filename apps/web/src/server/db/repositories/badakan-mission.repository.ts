import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import type { BadakanMissionToPersist } from '@/server/badakan-mission/sync'
import { isOpenNeed } from '@/view-models/badakan-need'
import {
  includeApplied,
  includeReferentials,
  persistFields,
} from './badakan-mission-persist'

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
      db.badakanMission.upsert({
        where: { badakanId: data.badakanId },
        create: {
          ...persistFields(data),
          jobTitleId: data.jobTitleId,
          searchApplied: { create: data.searchApplied },
        },
        update: {
          ...persistFields(data),
          ...(data.jobTitleId ? { jobTitleId: data.jobTitleId } : {}),
          searchApplied: { deleteMany: {}, create: data.searchApplied },
        },
      }),
  }
}

export const badakanMissionRepository = makeBadakanMissionRepository()
