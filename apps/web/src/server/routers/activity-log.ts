import { router, protectedProcedure } from '@/server/trpc'
import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import { toActivityLogRow } from '@/view-models/activity-log'
import { createActivityLogBatchSchema, createActivityLogSchema, listActivityLogSchema } from '@/view-models/activity-log.schema'

export type ActivityLogDeps = {
  listByEntity: typeof activityLogRepository.listByEntity
  create: typeof activityLogRepository.create
  createBatch: typeof activityLogRepository.createBatch
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
    createBatch: protectedProcedure.input(createActivityLogBatchSchema).mutation(async ({ ctx, input }) => {
      const rows = await deps.createBatch(
        input.entries.map((entry) => ({ ...entry, authorId: ctx.session.user.id })),
      )
      return rows.map(toActivityLogRow)
    }),
  })
}

export const activityLogRouter = makeActivityLogRouter({
  listByEntity: activityLogRepository.listByEntity,
  create: activityLogRepository.create,
  createBatch: activityLogRepository.createBatch,
})
