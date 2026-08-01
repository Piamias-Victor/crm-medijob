import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import type { DashboardOverview } from '@/view-models/home-overview'
import { loadDashboardAlerts } from './dashboard.alerts'
import { loadDashboardKpis } from './dashboard.kpis'

export type { DashboardOverview } from '@/view-models/home-overview'

export function makeDashboardRepository(db: PrismaClient = defaultDb) {
  return {
    getOverview: async (now: Date = new Date()): Promise<DashboardOverview> => {
      const [kpis, alerts] = await Promise.all([
        loadDashboardKpis(db, now),
        loadDashboardAlerts(db, now),
      ])
      return { ...kpis, alerts }
    },
  }
}

export const dashboardRepository = makeDashboardRepository()
