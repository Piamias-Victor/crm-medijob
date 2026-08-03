import type { ActivityLogRow } from '@/view-models/activity-log'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'
import type {
  PharmacyHistoryItem,
  PharmacyHistoryLogItem,
  PharmacyHistoryMissionItem,
} from '@/view-models/pharmacy-history.types'

export type {
  PharmacyHistoryItem,
  PharmacyHistoryLogItem,
  PharmacyHistoryMissionItem,
} from '@/view-models/pharmacy-history.types'

function toLogItem(log: ActivityLogRow): PharmacyHistoryLogItem {
  return { kind: 'log', ...log }
}

function toMissionItem(mission: PharmacyMissionRow): PharmacyHistoryMissionItem {
  return {
    kind: 'mission',
    id: mission.id,
    title: mission.title,
    status: mission.status,
    contractType: mission.contractType,
    jobTitle: mission.jobTitle,
    date: mission.updatedAt,
  }
}

export function toPharmacyHistoryItems(
  logs: ActivityLogRow[],
  terminalMissions: PharmacyMissionRow[],
): PharmacyHistoryItem[] {
  return [...logs.map(toLogItem), ...terminalMissions.map(toMissionItem)].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )
}
