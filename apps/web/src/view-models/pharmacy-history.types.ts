import type { ActivityLogRow } from '@/view-models/activity-log'
import type { PharmacyMissionRow } from '@/view-models/pharmacy-detail.types'

export type PharmacyHistoryLogItem = { kind: 'log' } & ActivityLogRow

export type PharmacyHistoryMissionItem = {
  kind: 'mission'
  id: string
  title: string
  status: PharmacyMissionRow['status']
  contractType: PharmacyMissionRow['contractType']
  jobTitle: string
  date: Date
}

export type PharmacyHistoryItem = PharmacyHistoryLogItem | PharmacyHistoryMissionItem
