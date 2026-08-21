import type { DevisStatus, DevisView } from '@/view-models/devis'
import { DEVIS_KIND_LABELS } from '@/view-models/devis-copy'
import { formatDevisPdfAmount } from '@/view-models/devis-pdf-format'

export const DEVIS_STATUS_LABELS: Record<DevisStatus, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  ACCEPTED: 'Accepté',
}

export function devisCurrentSummary(current: DevisView): string {
  const ht = current.amountHt == null ? '—' : formatDevisPdfAmount(current.amountHt)
  return `${DEVIS_STATUS_LABELS[current.status]} · ${DEVIS_KIND_LABELS[current.kind]} · ${ht} HT`
}
