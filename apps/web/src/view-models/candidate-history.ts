import type { ActivityLogRow } from '@/view-models/activity-log'
import type { RawCandidateMissionRow } from '@/view-models/candidate-missions'
import type {
  CandidateHistoryItem,
  CandidateHistoryLogItem,
  CandidateHistoryPositioning,
  CandidateHistoryPositioningItem,
} from '@/view-models/candidate-history.types'

export type {
  CandidateHistoryItem,
  CandidateHistoryLogItem,
  CandidateHistoryPositioning,
  CandidateHistoryPositioningItem,
} from '@/view-models/candidate-history.types'

function toLogItem(log: ActivityLogRow): CandidateHistoryLogItem {
  return { kind: 'log', ...log }
}

function toPositioningItem(row: CandidateHistoryPositioning): CandidateHistoryPositioningItem {
  return { kind: 'positioning', ...row }
}

export function toCandidateHistoryPositionings(
  rows: RawCandidateMissionRow[],
): CandidateHistoryPositioning[] {
  return rows.map((row) => ({
    id: row.mission.id,
    title: row.mission.title,
    stageName: row.stage.name,
    date: row.updatedAt,
  }))
}

export function toCandidateHistoryItems(
  logs: ActivityLogRow[],
  positionings: CandidateHistoryPositioning[],
): CandidateHistoryItem[] {
  return [...logs.map(toLogItem), ...positionings.map(toPositioningItem)].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )
}
