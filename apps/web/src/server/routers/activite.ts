import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { canViewActivity } from '@/server/auth/can-view-activity'
import { resolveActivitePeriod } from '@/view-models/activite-period'
import type { ActiviteOverview } from '@/view-models/activite-overview'
import { loadActiviteOverview } from '@/server/db/repositories/activite.repository'
import { prisma } from '@/server/db/repositories/client'

const inputSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
})

export type ActiviteDeps = {
  getOverview: (input: { from?: string; to?: string }) => Promise<ActiviteOverview>
}

export function makeActiviteRouter(deps: ActiviteDeps) {
  return router({
    overview: protectedProcedure.input(inputSchema).query(({ ctx, input }) => {
      if (!canViewActivity(ctx.session.user.role)) {
        throw new TRPCError({ code: 'FORBIDDEN' })
      }
      return deps.getOverview(input)
    }),
  })
}

export const activiteRouter = makeActiviteRouter({
  getOverview: async (input) => {
    const period = resolveActivitePeriod(input)
    return loadActiviteOverview(prisma, period)
  },
})
