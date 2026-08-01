import type { PharmacyStatus } from '@prisma/client'

export const STATUS_LABELS: Record<PharmacyStatus, string> = {
  PROSPECT: 'Prospect',
  ACTIF: 'Client',
  INACTIF: 'Inactif',
}

export const STATUS_BADGE: Record<PharmacyStatus, 'success' | 'warning' | 'default'> = {
  ACTIF: 'success',
  PROSPECT: 'warning',
  INACTIF: 'default',
}
