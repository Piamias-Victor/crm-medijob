import type { JobOfferStatus } from '@prisma/client'

export const JOB_OFFER_STATUS_LABELS: Record<JobOfferStatus, string> = {
  BROUILLON: 'Brouillon',
  PUBLIEE: 'Publiée',
  DEPUBLIEE: 'Dépubliée',
}

export function jobOfferStatusLabel(status: JobOfferStatus): string {
  return JOB_OFFER_STATUS_LABELS[status]
}
