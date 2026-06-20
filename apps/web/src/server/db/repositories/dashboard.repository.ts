import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

import type { DashboardOverview } from '@/view-models/home-overview'

export type { DashboardOverview } from '@/view-models/home-overview'

export function makeDashboardRepository(db: PrismaClient = defaultDb) {
  return {
    getOverview: async (): Promise<DashboardOverview> => {
      const [candidates, pharmacies, contacts, missionsActive, missionsTotal, inboxPending] =
        await Promise.all([
          db.candidate.count({ where: NOT_DELETED }),
          db.pharmacy.count({ where: NOT_DELETED }),
          db.contact.count({ where: NOT_DELETED }),
          db.mission.count({ where: { ...NOT_DELETED, status: 'A_POURVOIR' } }),
          db.mission.count({ where: NOT_DELETED }),
          db.application.count({ where: { status: 'EN_ATTENTE', deletedAt: null } }),
        ])
      return { candidates, pharmacies, contacts, missionsActive, missionsTotal, inboxPending }
    },
  }
}

export const dashboardRepository = makeDashboardRepository()
