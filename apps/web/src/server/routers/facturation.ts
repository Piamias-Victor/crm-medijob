import { router, financeProcedure } from '@/server/trpc'
import { facturationSuiviFiltersSchema } from '@/view-models/facturation-suivi-filters.schema'
import { createFinanceLineSchema, generateDevisFromLineSchema } from '@/view-models/finance-line.schema'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { CreateFinanceLineInput } from '@/view-models/finance-line.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationOverview } from '@/view-models/facturation-overview'
import type { FacturationMissionOption, FinanceLineRecord } from '@/view-models/finance-line'
import type { GenerateDevisFromLineResult } from '@/lib/finance/generate-devis-from-line'

type Ref = { id: string; name: string }

export type FacturationDeps = {
  listSuivi: (filters?: FacturationSuiviFilters) => Promise<FacturationSuiviRow[]>
  overview: (filters?: FacturationSuiviFilters) => Promise<FacturationOverview>
  referentials: () => Promise<{
    pharmacies: Ref[]
    recruiters: Ref[]
    candidates: Ref[]
    missions: FacturationMissionOption[]
  }>
  createLine: (input: CreateFinanceLineInput) => Promise<FinanceLineRecord>
  generateDevisFromLine: (id: string) => Promise<GenerateDevisFromLineResult>
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
    createLine: financeProcedure
      .input(createFinanceLineSchema)
      .mutation(({ input }) => deps.createLine(input)),
    generateDevisFromLine: financeProcedure
      .input(generateDevisFromLineSchema)
      .mutation(({ input }) => deps.generateDevisFromLine(input.id)),
  })
}
