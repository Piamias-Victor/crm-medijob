import type { ActivityLogEntity } from '@/view-models/activity-log'
import type { MissionQuickViewEntity } from '@/view-models/mission-quick-view.types'

export type MissionQuickViewRepoRow = Omit<MissionQuickViewEntity, 'lastActivity'> & {
  activities: ActivityLogEntity[]
}

export function toMissionQuickViewEntity(row: MissionQuickViewRepoRow): MissionQuickViewEntity {
  const { activities, ...rest } = row
  return { ...rest, lastActivity: activities[0] ?? null }
}
