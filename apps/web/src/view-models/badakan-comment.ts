import { formatActivityDate } from '@/view-models/activity-log-display'

export type BadakanCommentRow = {
  id: string
  content: string
  authorName: string
  date: Date
}

export const BADAKAN_COMMENTS_TITLE = 'Commentaires Badakan'

export function toBadakanInternalNotes(comments: BadakanCommentRow[]): string {
  return comments
    .map((c) => `${c.authorName} · ${formatActivityDate(c.date)}\n${c.content}`)
    .join('\n\n')
}
