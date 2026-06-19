import type { ActivityType } from '@prisma/client'

type BadgeVariant = 'default' | 'primary' | 'accent' | 'success' | 'warning'

export const ACTIVITY_TYPE_BADGE: Record<ActivityType, BadgeVariant> = {
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
