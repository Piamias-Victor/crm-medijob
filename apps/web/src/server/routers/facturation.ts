import { router, financeProcedure } from '@/server/trpc'
import { facturationSuiviFiltersSchema } from '@/view-models/facturation-suivi-filters.schema'
import {
  createFinanceLineSchema,
  financeLineDevisSchema,
  generateDevisFromLineSchema,
} from '@/view-models/finance-line.schema'
import type { FacturationSuiviFilters } from '@/view-models/facturation-suivi-filters.schema'
import type { CreateFinanceLineInput, FinanceLineDevisInput } from '@/view-models/finance-line.schema'
import type { FacturationSuiviRow } from '@/view-models/facturation-suivi'
import type { FacturationOverview } from '@/view-models/facturation-overview'
import type { FacturationMissionOption, FinanceLineRecord } from '@/view-models/finance-line'
import type { GenerateDevisFromLineResult } from '@/lib/finance/generate-devis-from-line'
import type { SendDevisFromLineResult } from '@/server/finance/send-devis-from-line'
import type { DevisView } from '@/view-models/devis'
import type { DevisPdfModel } from '@/view-models/devis-pdf-model'

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
  sendDevisFromLine: (id: string, authorId: string) => Promise<SendDevisFromLineResult>
  previewDevis: (input: FinanceLineDevisInput) => Promise<{ quote: DevisPdfModel }>
  saveDevis: (input: FinanceLineDevisInput) => Promise<DevisView>
  sendDevis: (input: FinanceLineDevisInput, authorId: string) => Promise<SendDevisFromLineResult>
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
    sendDevisFromLine: financeProcedure
      .input(generateDevisFromLineSchema)
      .mutation(({ ctx, input }) => deps.sendDevisFromLine(input.id, ctx.session.user.id)),
    previewDevis: financeProcedure
      .input(financeLineDevisSchema)
      .mutation(({ input }) => deps.previewDevis(input)),
    saveDevis: financeProcedure
      .input(financeLineDevisSchema)
      .mutation(({ input }) => deps.saveDevis(input)),
    sendDevis: financeProcedure
      .input(financeLineDevisSchema)
      .mutation(({ ctx, input }) => deps.sendDevis(input, ctx.session.user.id)),
  })
}
