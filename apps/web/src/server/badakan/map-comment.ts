import type { BadakanCommentRow } from '@/view-models/badakan-comment'
import {
  badakanCommentItemSchema,
  badakanCommentsEnvelopeSchema,
  type BadakanCommentItemRaw,
} from './map-comment.schema'

export type BadakanComment = BadakanCommentRow

function authorName(author: BadakanCommentItemRaw['author']): string {
  if (!author) return ''
  const full = [author.firstName, author.lastName].filter(Boolean).join(' ').trim()
  return full || author.name?.trim() || ''
}

function textOf(raw: BadakanCommentItemRaw): string | undefined {
  return raw.comment?.trim() || raw.content?.trim() || undefined
}

function dateOf(raw: BadakanCommentItemRaw): Date | null {
  const value = raw.creationDate ?? raw.createdAt
  if (!value) return new Date(0)
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function mapOne(raw: unknown, index: number): BadakanComment | null {
  const parsed = badakanCommentItemSchema.safeParse(raw)
  if (!parsed.success) return null
  const content = textOf(parsed.data)
  const date = dateOf(parsed.data)
  if (!content || !date) return null
  return {
    id: parsed.data.id != null ? String(parsed.data.id) : String(index),
    content,
    authorName: authorName(parsed.data.author),
    date,
  }
}

function itemsOf(raw: unknown): unknown[] {
  const parsed = badakanCommentsEnvelopeSchema.safeParse(raw)
  if (!parsed.success) return []
  if (Array.isArray(parsed.data)) return parsed.data
  if ('comments' in parsed.data && Array.isArray(parsed.data.comments)) return parsed.data.comments
  if ('content' in parsed.data && Array.isArray(parsed.data.content)) return parsed.data.content
  return []
}

export function mapBadakanComments(raw: unknown): BadakanComment[] {
  return itemsOf(raw).flatMap((item, index) => {
    const mapped = mapOne(item, index)
    return mapped ? [mapped] : []
  })
}
