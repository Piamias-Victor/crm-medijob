import type { PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import { facturationMissionSelect } from './facturation.repository.select'
import { toFacturationMissionRecord } from './facturation.repository.map'

export function makeFacturationRepository(db: PrismaClient = defaultDb) {
  return {
    listMissions: async () => {
      const rows = await db.mission.findMany({
        where: NOT_DELETED,
        orderBy: { createdAt: 'desc' },
        select: facturationMissionSelect,
        take: DEFAULT_LIST_LIMIT,
      })
      return rows.map(toFacturationMissionRecord)
    },
  }
}

export const facturationRepository = makeFacturationRepository()
