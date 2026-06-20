import type { ActivityTypeValue } from '@/view-models/activity-log-form.schema'

export const ACTIVITY_TYPE_LABELS: Record<ActivityTypeValue, string> = {
  APPEL: 'Appel',
  EMAIL: 'Email',
  ENTRETIEN: 'Entretien',
  MISSION: 'Mission',
  NOTE: 'Note',
  ACTION_COMMERCIALE: 'Action commerciale',
  DEVIS: 'Devis',
  AUTRE: 'Autre',
}

export const ACTIVITY_TYPE_OPTIONS = (
  Object.entries(ACTIVITY_TYPE_LABELS) as [ActivityTypeValue, string][]
).map(([value, label]) => ({ value, label }))
