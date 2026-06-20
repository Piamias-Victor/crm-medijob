import type { RawMission } from '@/view-models/mission-kanban.types'
import { toMissionListItems, type MissionListItem } from '@/view-models/mission-kanban'

export type MissionListRow = MissionListItem

export function toMissionListRow(mission: RawMission): MissionListRow {
  return toMissionListItems([mission])[0]!
}

export function toMissionListRows(missions: RawMission[]): MissionListRow[] {
  return toMissionListItems(missions)
}
