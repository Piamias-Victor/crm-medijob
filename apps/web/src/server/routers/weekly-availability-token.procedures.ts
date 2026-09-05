import { TRPCError } from '@trpc/server'
import { publicProcedure } from '@/server/trpc'
import {
  getMonthInputSchema,
  getWeekInputSchema,
  saveMonthInputSchema,
  saveWeekInputSchema,
} from '@/view-models/weekly-availability.schema'
import { getWeek } from '@/server/weekly-availability/get-week'
import { saveWeek } from '@/server/weekly-availability/save-week'
import { getMonth } from '@/server/weekly-availability/get-month'
import { saveMonth } from '@/server/weekly-availability/save-month'
import type { WeeklyAvailabilityDeps } from './weekly-availability.deps'

function weekOrThrow(result: Awaited<ReturnType<typeof getWeek>>) {
  if (!result.ok) throw new TRPCError({ code: 'NOT_FOUND' })
  return result.week
}

export function weeklyAvailabilityTokenProcedures(deps: WeeklyAvailabilityDeps) {
  return {
    getWeek: publicProcedure.input(getWeekInputSchema).query(async ({ input }) => {
      const result = await getWeek(deps.store, input)
      if (!result.ok) return null
      return result.week
    }),
    saveWeek: publicProcedure
      .input(saveWeekInputSchema)
      .mutation(async ({ input }) => weekOrThrow(await saveWeek(deps.store, input))),
    getMonth: publicProcedure.input(getMonthInputSchema).query(async ({ input }) => {
      const result = await getMonth(deps.store, input)
      return result.ok ? result.month : null
    }),
    saveMonth: publicProcedure.input(saveMonthInputSchema).mutation(async ({ input }) => {
      const result = await saveMonth(deps.store, input)
      if (!result.ok) throw new TRPCError({ code: 'NOT_FOUND' })
      return result.month
    }),
  }
}
