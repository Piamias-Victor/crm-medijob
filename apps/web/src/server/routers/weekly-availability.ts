import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '@/server/trpc'
import { candidateIdSchema } from '@/view-models/candidate-profile.schema'
import { getWeekInputSchema, saveWeekInputSchema } from '@/view-models/weekly-availability.schema'
import { weeklyAvailabilityFilterInputSchema } from '@/view-models/weekly-availability-filter.schema'
import { toAvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'
import { getWeek } from '@/server/weekly-availability/get-week'
import { saveWeek } from '@/server/weekly-availability/save-week'
import { ensureLink } from '@/server/weekly-availability/ensure-link'
import { filterAvailable } from '@/server/weekly-availability/filter-available'
import { weeklyAvailabilityUrl } from '@/view-models/weekly-availability-path'
import {
  defaultWeeklyAvailabilityDeps,
  type WeeklyAvailabilityDeps,
} from './weekly-availability.deps'

function weekOrThrow(result: Awaited<ReturnType<typeof getWeek>>) {
  if (!result.ok) throw new TRPCError({ code: 'NOT_FOUND' })
  return result.week
}

export function makeWeeklyAvailabilityRouter(deps: WeeklyAvailabilityDeps) {
  return router({
    getWeek: publicProcedure.input(getWeekInputSchema).query(async ({ input }) => {
      const result = await getWeek(deps.store, input)
      if (!result.ok) return null
      return result.week
    }),
    saveWeek: publicProcedure.input(saveWeekInputSchema).mutation(async ({ input }) =>
      weekOrThrow(await saveWeek(deps.store, input)),
    ),
    filter: protectedProcedure
      .input(weeklyAvailabilityFilterInputSchema)
      .query(async ({ input }) => {
        const rows = await filterAvailable({
          filterStore: deps.filterStore,
          lookupGeo: deps.lookupGeo,
          input,
        })
        return rows.map(toAvailabilityFilterRow)
      }),
    copyLink: protectedProcedure.input(candidateIdSchema).mutation(async ({ input }) => {
      const result = await ensureLink(deps.store, {
        candidateId: input.id,
        createToken: deps.createToken,
      })
      if (!result.ok && result.reason === 'not_found') {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      if (!result.ok) return null
      return { url: weeklyAvailabilityUrl(deps.getBaseUrl(), result.token) }
    }),
    resendSms: protectedProcedure.input(candidateIdSchema).mutation(async ({ input }) => {
      const result = await deps.resendSms(input.id)
      if (result === 'not_found') throw new TRPCError({ code: 'NOT_FOUND' })
      if (result === 'not_app') return null
      if (result === 'skippedNoPhone') return { sent: false as const }
      return { sent: true as const }
    }),
  })
}

export const weeklyAvailabilityRouter = makeWeeklyAvailabilityRouter(
  defaultWeeklyAvailabilityDeps(),
)
