'use client'

import { History } from 'lucide-react'
import type { ActivityLogRow } from '@/view-models/activity-log'
import { formatActivityDate } from '@/view-models/activity-log-display'
import { Badge } from '@/components/atoms/Badge'
import { EmptyState } from '@/components/atoms/EmptyState'

type Props = { logs: ActivityLogRow[] }

export function ActivityLogTimeline({ logs }: Props) {
  if (!logs.length) {
    return (
      <EmptyState
        icon={History}
        title="Aucune activité"
        description="Ajoutez une note ou une action commerciale pour démarrer l'historique."
      />
    )
  }

  return (
    <ol className="relative flex flex-col gap-4 border-l border-border/70 pl-5">
      {logs.map((log) => (
        <li key={log.id} className="relative flex flex-col gap-2 rounded-xl border border-border/60 bg-white/70 p-4">
          <span className="absolute -left-[1.625rem] top-5 size-2.5 rounded-full bg-accent ring-4 ring-white" />
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{log.typeLabel}</Badge>
            <span className="text-xs text-fg-muted">{formatActivityDate(log.date)}</span>
          </div>
          <p className="text-sm text-fg-muted">Par {log.authorName}</p>
          {log.content ? <p className="text-sm text-fg">{log.content}</p> : null}
        </li>
      ))}
    </ol>
  )
}
