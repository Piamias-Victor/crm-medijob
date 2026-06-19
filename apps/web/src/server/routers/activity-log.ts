import type { ActivityType } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { activityLogRepository } from '@/server/db/repositories/activity-log.repository'
import {
  activityLogCreateSchema,
  activityLogListSchema,
} from '@/view-models/activity-log-form.schema'
import { toActivityLogRow, type ActivityLogEntity } from '@/view-models/activity-log-list'

export type ActivityLogDeps = {
  repo: {
    list: (input: {
      contactId?: string
      pharmacyId?: string
      types?: ActivityType[]
    }) => Promise<ActivityLogEntity[]>
    create: (input: {
      contactId?: string
      pharmacyId?: string
      authorId: string
      type: ActivityType
      content?: string
      date?: Date
    }) => Promise<ActivityLogEntity>
  }
}

export function makeActivityLogRouter(deps: ActivityLogDeps) {
  return router({
    list: protectedProcedure.input(activityLogListSchema).query(async ({ input }) => {
      const rows = await deps.repo.list(input)
      return rows.map(toActivityLogRow)
    }),
    create: protectedProcedure
      .input(activityLogCreateSchema)
      .mutation(async ({ input, ctx }) => {
        const row = await deps.repo.create({
          ...input,
          authorId: ctx.session.user.id,
        })
        return toActivityLogRow(row)
      }),
  })
}

export const activityLogRouter = makeActivityLogRouter({ repo: activityLogRepository })
