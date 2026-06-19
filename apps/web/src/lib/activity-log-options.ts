import { ACTIVITY_TYPES } from '@/view-models/activity-log-form.schema'

export const ACTIVITY_TYPE_LABELS: Record<(typeof ACTIVITY_TYPES)[number], string> = {
  APPEL: 'Appel',
  EMAIL: 'Email',
  ENTRETIEN: 'Entretien',
  MISSION: 'Mission',
  NOTE: 'Note',
  ACTION_COMMERCIALE: 'Action commerciale',
  DEVIS: 'Devis',
  AUTRE: 'Autre',
}

export const ACTIVITY_TYPE_OPTIONS = ACTIVITY_TYPES.map((value) => ({
  value,
  label: ACTIVITY_TYPE_LABELS[value],
}))

export function formatActivityDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
