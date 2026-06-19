import type { ActivityType } from '@prisma/client'

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
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
  Object.entries(ACTIVITY_TYPE_LABELS) as [ActivityType, string][]
).map(([value, label]) => ({ value, label }))
