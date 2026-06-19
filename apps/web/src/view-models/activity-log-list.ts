import type { ActivityType } from '@prisma/client'

export type ActivityLogEntity = {
  id: string
  type: ActivityType
  content: string | null
  date: Date
  author: { name: string }
}

export type ActivityLogRow = {
  id: string
  type: ActivityType
  content: string | null
  date: Date
  authorName: string
}

export function toActivityLogRow(entity: ActivityLogEntity): ActivityLogRow {
  return {
    id: entity.id,
    type: entity.type,
    content: entity.content,
    date: entity.date,
    authorName: entity.author.name,
  }
}
