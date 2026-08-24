import { router, financeProcedure } from '@/server/trpc'
import { facturationSuiviFiltersSchema } from '@/view-models/facturation-suivi-filters.schema'
import { facturationLineListFiltersSchema } from '@/view-models/facturation-line-filters.schema'
import {
  createFinanceLineSchema,
  financeLineDevisSchema,
  generateDevisFromLineSchema,
} from '@/view-models/finance-line.schema'
import { setLineInvoicedSchema, setLinePaidSchema } from '@/view-models/finance-line-marks.schema'
import type { FacturationDeps } from '@/server/routers/facturation.deps'

export type { FacturationDeps } from '@/server/routers/facturation.deps'

export function makeFacturationRouter(deps: FacturationDeps) {
  return router({
    listSuivi: financeProcedure
      .input(facturationSuiviFiltersSchema.optional())
      .query(async ({ input }) => ({ rows: await deps.listSuivi(input) })),
    listLines: financeProcedure
      .input(facturationLineListFiltersSchema)
      .query(async ({ input }) => ({ rows: await deps.listLines(input) })),
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
    cancelLine: financeProcedure
      .input(generateDevisFromLineSchema)
      .mutation(({ input }) => deps.cancelLine(input.id)),
    restoreLine: financeProcedure
      .input(generateDevisFromLineSchema)
      .mutation(({ input }) => deps.restoreLine(input.id)),
    setInvoiced: financeProcedure
      .input(setLineInvoicedSchema)
      .mutation(({ input }) => deps.setInvoiced(input.id, input.invoiced)),
    setPaid: financeProcedure
      .input(setLinePaidSchema)
      .mutation(({ input }) => deps.setPaid(input.id, input.paid)),
  })
}
