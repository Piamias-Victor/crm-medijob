import { router, protectedProcedure } from '@/server/trpc'
import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import { toActivityLogRow } from '@/view-models/activity-log'
import { createActivityLogSchema, listActivityLogSchema } from '@/view-models/activity-log.schema'

export type ActivityLogDeps = {
  listByEntity: typeof activityLogRepository.listByEntity
  create: typeof activityLogRepository.create
}

export function makeActivityLogRouter(deps: ActivityLogDeps) {
  return router({
    listByEntity: protectedProcedure.input(listActivityLogSchema).query(async ({ input }) => {
      const rows = await deps.listByEntity(input)
      return rows.map(toActivityLogRow)
    }),
    create: protectedProcedure.input(createActivityLogSchema).mutation(async ({ ctx, input }) => {
      const row = await deps.create({ ...input, authorId: ctx.session.user.id })
      return toActivityLogRow(row)
    }),
  })
}

export const activityLogRouter = makeActivityLogRouter({
  listByEntity: activityLogRepository.listByEntity,
  create: activityLogRepository.create,
})
