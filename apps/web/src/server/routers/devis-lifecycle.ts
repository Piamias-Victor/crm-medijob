import { protectedProcedure } from '@/server/trpc'
import { acceptDevis } from '@/server/devis/accept-devis'
import { invoiceDevis } from '@/server/devis/invoice-devis'
import { mapDevisSendError } from '@/server/devis/map-devis-send-error'
import { acceptDevisSchema, markInvoicedSchema } from '@/view-models/devis.schema'
import { toDevisView } from '@/view-models/devis'
import type { AcceptDevisDeps } from '@/server/devis/accept-devis'
import type { InvoiceDevisDeps } from '@/server/devis/invoice-devis'

export function devisAcceptMutation(deps: AcceptDevisDeps) {
  return protectedProcedure.input(acceptDevisSchema).mutation(async ({ ctx, input }) => {
    try {
      return toDevisView(await acceptDevis(input.missionId, ctx.session.user.id, deps))
    } catch (error) {
      throw mapDevisSendError(error)
    }
  })
}

export function devisMarkInvoicedMutation(deps: InvoiceDevisDeps) {
  return protectedProcedure.input(markInvoicedSchema).mutation(async ({ input }) => {
    try {
      return toDevisView(await invoiceDevis(input.missionId, input.invoicedAt, deps))
    } catch (error) {
      throw mapDevisSendError(error)
    }
  })
}
