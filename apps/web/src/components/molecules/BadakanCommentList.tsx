import { formatActivityDate } from '@/view-models/activity-log-display'
import type { BadakanCommentRow } from '@/view-models/badakan-comment'

type Props = { comments: BadakanCommentRow[] }

export function BadakanCommentList({ comments }: Props) {
  if (comments.length === 0) {
    return <p className="text-sm text-fg-muted">Aucun commentaire Badakan.</p>
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <li key={comment.id} className="border-l-2 border-accent-muted pl-4">
          <p className="text-sm text-fg">{comment.content}</p>
          <p className="mt-1 text-xs text-fg-muted">
            {comment.authorName} · {formatActivityDate(comment.date)}
          </p>
        </li>
      ))}
    </ul>
  )
}
