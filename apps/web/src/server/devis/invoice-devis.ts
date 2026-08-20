import { pickCurrentDevis } from '@/lib/finance/pick-current-devis'
import { SendDevisError } from '@/server/devis/send-devis'
import type { DevisRecord } from '@/view-models/devis'

export type InvoiceDevisDeps = {
  listByMission: (missionId: string) => Promise<DevisRecord[]>
  markInvoiced: (id: string, invoicedAt: Date) => Promise<DevisRecord | null>
}

export async function invoiceDevis(
  missionId: string,
  invoicedAt: Date,
  deps: InvoiceDevisDeps,
) {
  const current = pickCurrentDevis(await deps.listByMission(missionId))
  if (!current || current.status !== 'ACCEPTED') {
    throw new SendDevisError('BAD_REQUEST', 'Aucun devis accepté à facturer')
  }
  const invoiced = await deps.markInvoiced(current.id, invoicedAt)
  if (!invoiced) throw new SendDevisError('NOT_FOUND', 'Devis introuvable')
  return invoiced
}
