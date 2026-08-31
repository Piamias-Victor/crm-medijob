import { TRPCError } from '@trpc/server'
import { router, publicProcedure, protectedProcedure } from '@/server/trpc'
import { candidateIdSchema } from '@/view-models/candidate-profile.schema'
import { getWeekInputSchema, saveWeekInputSchema } from '@/view-models/weekly-availability.schema'
import { getWeek } from '@/server/weekly-availability/get-week'
import { saveWeek } from '@/server/weekly-availability/save-week'
import { ensureLink } from '@/server/weekly-availability/ensure-link'
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
  })
}

export const weeklyAvailabilityRouter = makeWeeklyAvailabilityRouter(
  defaultWeeklyAvailabilityDeps(),
)
