import type { CommercialStatus } from '@/lib/finance/derive-commercial-status'

export const COMMERCIAL_STATUS_LABELS: Record<CommercialStatus, string> = {
  SANS_DEVIS: 'Sans devis',
  ENVOYE: 'Envoyé',
  ACCEPTE: 'Accepté',
  FACTURE: 'Facturé',
}

export const COMMERCIAL_STATUS_BADGE: Record<
  CommercialStatus,
  'default' | 'accent' | 'success' | 'primary'
> = {
  SANS_DEVIS: 'default',
  ENVOYE: 'accent',
  ACCEPTE: 'success',
  FACTURE: 'primary',
}
