import { router, protectedProcedure } from '@/server/trpc'
import { dashboardRepository } from '@/server/db/repositories/dashboard.repository'
import type { DashboardOverview } from '@/view-models/home-overview'

export type DashboardDeps = {
  getOverview: () => Promise<DashboardOverview>
}

export function makeDashboardRouter(deps: DashboardDeps) {
  return router({
    overview: protectedProcedure.query(() => deps.getOverview()),
  })
}

export const dashboardRouter = makeDashboardRouter({
  getOverview: () => dashboardRepository.getOverview(),
})
