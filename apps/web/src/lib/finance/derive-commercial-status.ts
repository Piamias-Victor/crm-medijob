import type { DevisStatus } from '@/view-models/devis'

export const COMMERCIAL_STATUSES = ['SANS_DEVIS', 'ENVOYE', 'ACCEPTE', 'FACTURE'] as const

export type CommercialStatus = (typeof COMMERCIAL_STATUSES)[number]

type CurrentQuote = {
  status: DevisStatus
  invoicedAt: Date | null
}

export function deriveCommercialStatus(current: CurrentQuote | null): CommercialStatus {
  if (!current) return 'SANS_DEVIS'
  if (current.status === 'SENT') return 'ENVOYE'
  if (current.status === 'ACCEPTED' && current.invoicedAt) return 'FACTURE'
  if (current.status === 'ACCEPTED') return 'ACCEPTE'
  return 'SANS_DEVIS'
}
