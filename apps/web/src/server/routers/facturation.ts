import { router, financeProcedure } from '@/server/trpc'
import { facturationSuiviFiltersSchema } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationOverview } from '@/view-models/facturation-overview'

type Ref = { id: string; name: string }

export type FacturationDeps = {
  listSuivi: (filters?: FacturationSuiviFilters) => Promise<FacturationSuiviRow[]>
  overview: (filters?: FacturationSuiviFilters) => Promise<FacturationOverview>
  referentials: () => Promise<{ pharmacies: Ref[]; recruiters: Ref[] }>
}

export function makeFacturationRouter(deps: FacturationDeps) {
  return router({
    listSuivi: financeProcedure
      .input(facturationSuiviFiltersSchema.optional())
      .query(async ({ input }) => ({ rows: await deps.listSuivi(input) })),
    overview: financeProcedure
      .input(facturationSuiviFiltersSchema.optional())
      .query(({ input }) => deps.overview(input)),
    referentials: financeProcedure.query(() => deps.referentials()),
  })
}
