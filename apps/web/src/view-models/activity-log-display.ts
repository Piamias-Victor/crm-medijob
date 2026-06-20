import type { ActivityTypeValue } from '@/view-models/activity-log-form.schema'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning'

export const ACTIVITY_TYPE_BADGE: Record<ActivityTypeValue, BadgeVariant> = {
  APPEL: 'primary',
  EMAIL: 'accent',
  ENTRETIEN: 'success',
  MISSION: 'primary',
  NOTE: 'default',
  ACTION_COMMERCIALE: 'warning',
  DEVIS: 'warning',
  AUTRE: 'default',
}

export function formatActivityDate(value: Date) {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short' }).format(value)
}
