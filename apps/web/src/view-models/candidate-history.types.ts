import type { ActivityLogRow } from '@/view-models/activity-log'

export type CandidateHistoryLogItem = { kind: 'log' } & ActivityLogRow

export type CandidateHistoryPositioning = {
  id: string
  title: string
  stageName: string
  date: Date
}

export type CandidateHistoryPositioningItem = {
  kind: 'positioning'
} & CandidateHistoryPositioning

export type CandidateHistoryItem = CandidateHistoryLogItem | CandidateHistoryPositioningItem
