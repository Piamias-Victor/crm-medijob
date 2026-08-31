import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { toBadakanMissionListItems } from '@/view-models/badakan-mission-list'
import { toBadakanMissionDetail } from '@/view-models/badakan-mission-detail'
import { parseBadakanMissionPeriods } from '@/view-models/badakan-mission-periods'
import { defaultBadakanMissionDeps, type BadakanMissionDeps } from './badakan-mission.deps'

function withPeriods<T extends { periods: unknown }>(row: T) {
  return { ...row, periods: parseBadakanMissionPeriods(row.periods) }
}

export function makeBadakanMissionRouter(deps: BadakanMissionDeps) {
  return router({
    list: protectedProcedure.query(async () => {
      const rows = await deps.list()
      return toBadakanMissionListItems(rows.map(withPeriods))
    }),
    getById: protectedProcedure.input(z.object({ id: z.string().min(1) })).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      if (!row) return null
      return toBadakanMissionDetail(withPeriods(row))
    }),
  })
}

export const badakanMissionRouter = makeBadakanMissionRouter(defaultBadakanMissionDeps)

