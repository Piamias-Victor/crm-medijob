'use client'

import { Badge } from '@/components/atoms/Badge'
import { ACTIVITY_TYPE_BADGE, formatActivityDate } from '@/view-models/activity-log-display'
import type { ActivityLogRow } from '@/view-models/activity-log'

type Props = { entry: ActivityLogRow }

export function ActivityTimelineItem({ entry }: Props) {
  return (
    <article className="relative border-l-2 border-accent-muted pb-6 pl-4 last:pb-0">
      <span className="absolute -left-[5px] top-1 size-2 rounded-full bg-accent" aria-hidden />
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={ACTIVITY_TYPE_BADGE[entry.type]}>{entry.typeLabel}</Badge>
        <time className="text-xs text-fg-muted" dateTime={entry.date.toISOString()}>
          {formatActivityDate(entry.date)}
        </time>
      </div>
      {entry.content ? <p className="mt-2 text-sm text-fg">{entry.content}</p> : null}
      <p className="mt-1 text-xs text-fg-muted">Par {entry.authorName}</p>
    </article>
  )
}
