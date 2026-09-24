import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { BadakanCommentRow } from './badakan-comment'

export function badakanCommentsListLabel(comments: BadakanCommentRow[]): string {
  if (comments.length === 0) return TABLE_EMPTY_CELL
  return comments.map((c) => c.content).join(' · ')
}
