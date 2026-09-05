import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { candidateIdSchema } from '@/view-models/candidate-profile.schema'
import {
  candidateMonthInputSchema,
  saveCandidateMonthInputSchema,
} from '@/view-models/weekly-availability.schema'
import { currentMonth } from '@/lib/paris-month'
import { weeklyAvailabilityFilterInputSchema } from '@/view-models/weekly-availability-filter.schema'
import { availabilitySearchFiltersSchema } from '@/view-models/weekly-availability-search.schema'
import { toAvailabilityFilterRow } from '@/view-models/weekly-availability-filter-row'
import { toDeclaredAvailabilityRow } from '@/view-models/weekly-availability-declared-row'
import { readMonthSlots } from '@/server/weekly-availability/get-month'
import { saveCandidateMonth } from '@/server/weekly-availability/save-candidate-month'
import { ensureLink } from '@/server/weekly-availability/ensure-link'
import { filterAvailable } from '@/server/weekly-availability/filter-available'
import { searchDeclared } from '@/server/weekly-availability/search-declared'
import { weeklyAvailabilityUrl } from '@/view-models/weekly-availability-path'
import { weeklyAvailabilityTokenProcedures } from './weekly-availability-token.procedures'
import {
  defaultWeeklyAvailabilityDeps,
  type WeeklyAvailabilityDeps,
} from './weekly-availability.deps'

export function makeWeeklyAvailabilityRouter(deps: WeeklyAvailabilityDeps) {
  return router({
    ...weeklyAvailabilityTokenProcedures(deps),
    candidateMonth: protectedProcedure
      .input(candidateMonthInputSchema)
      .query(async ({ input }) => {
        const month = input.month ?? currentMonth(new Date())
        return { month, slots: await readMonthSlots(deps.store, input.candidateId, month) }
      }),
    saveCandidateMonth: protectedProcedure
      .input(saveCandidateMonthInputSchema)
      .mutation(async ({ input }) => {
        const result = await saveCandidateMonth(deps.store, input)
        if (!result.ok) throw new TRPCError({ code: 'NOT_FOUND' })
        return result.month
      }),
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
    search: protectedProcedure
      .input(availabilitySearchFiltersSchema.optional())
      .query(async ({ input }) => {
        const rows = await searchDeclared({
          store: deps.declaredStore,
          lookupGeo: deps.lookupGeo,
          input: input ?? {},
          today: new Date(),
        })
        return rows.map(toDeclaredAvailabilityRow)
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
