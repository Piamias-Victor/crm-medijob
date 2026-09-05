import type { BadgeVariant } from '@/components/atoms/Badge'

const STATUS_VARIANTS: Record<string, BadgeVariant> = {
  DRAFT: 'default',
  CREATED: 'sky',
  VALIDATED: 'success',
  CANCELLED: 'error',
}

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  CREATED: 'Créé',
  VALIDATED: 'Validé',
  CANCELLED: 'Annulé',
}

export function badakanContractStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status
}

export function badakanContractStatusVariant(status: string): BadgeVariant {
  return STATUS_VARIANTS[status] ?? 'default'
}

export const badakanContractStatusOptions = Object.entries(STATUS_LABELS).map(
  ([value, label]) => ({ value, label }),
)
