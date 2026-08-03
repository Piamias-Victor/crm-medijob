import type { ActivityLogEntity } from '@/view-models/activity-log'
import type { PharmacyQuickViewEntity } from '@/view-models/pharmacy-quick-view.types'

export type PharmacyQuickViewRepoRow = Omit<PharmacyQuickViewEntity, 'lastActivity'> & {
  activities: ActivityLogEntity[]
}

export function toPharmacyQuickViewEntity(row: PharmacyQuickViewRepoRow): PharmacyQuickViewEntity {
  const { activities, ...rest } = row
  return { ...rest, lastActivity: activities[0] ?? null }
}
