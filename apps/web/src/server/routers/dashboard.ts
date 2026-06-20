import { router, protectedProcedure } from '@/server/trpc'
import { dashboardRepository } from '@/server/db/repositories/dashboard.repository'

export const dashboardRouter = router({
  overview: protectedProcedure.query(() => dashboardRepository.getOverview()),
})
