import type { ActivityTypeValue } from '@/view-models/activity-log-form.schema'
import { ACTIVITY_TYPE_LABELS } from '@/view-models/activity-log.labels'

export type ActivityLogEntity = {
  id: string
  type: ActivityTypeValue
  content: string | null
  date: Date
  createdAt: Date
  author: { name: string }
}

export type ActivityLogRow = {
  id: string
  type: ActivityTypeValue
  typeLabel: string
  content: string | null
  date: Date
  authorName: string
}

export function toActivityLogRow(entry: ActivityLogEntity): ActivityLogRow {
  return {
    id: entry.id,
    type: entry.type,
    typeLabel: ACTIVITY_TYPE_LABELS[entry.type],
    content: entry.content,
    date: entry.date,
    authorName: entry.author.name,
  }
}
