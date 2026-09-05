import type { BadgeVariant } from '@/components/atoms/Badge'

const STEP_VARIANTS: Record<string, BadgeVariant> = {
  DRAFT: 'default',
  CREATED: 'sky',
  PROPOSE: 'warning',
  STAFFED: 'success',
  COMPLETED: 'primary',
  CANCELLED: 'error',
}

const STEP_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  CREATED: 'Créée',
  PROPOSE: 'Proposé',
  STAFFED: 'Staffée',
  COMPLETED: 'Terminée',
  CANCELLED: 'Annulée',
}

export function badakanMissionStepLabel(step: string): string {
  return STEP_LABELS[step] ?? step
}

export function badakanMissionStepVariant(step: string): BadgeVariant {
  return STEP_VARIANTS[step] ?? 'default'
}

export const badakanMissionStepOptions = Object.entries(STEP_LABELS).map(([value, label]) => ({
  value,
  label,
}))
