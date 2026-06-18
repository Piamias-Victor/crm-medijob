'use client'

import { type DragEvent } from 'react'
import type { MissionStatus } from '@prisma/client'
import { cn } from '@/lib/cn'
import { MissionKanbanCardView } from '@/components/molecules/MissionKanbanCard'
import { readMissionDragPayload } from '@/components/molecules/kanban-dnd'
import { MISSION_STATUS_THEME } from '@/lib/mission-status-theme'
import type { MissionKanbanColumn } from '@/view-models/mission-kanban'

type Props = {
  column: MissionKanbanColumn
  onDrop: (missionId: string, status: MissionStatus) => void
}

export function MissionKanbanColumnView({ column, onDrop }: Props) {
  const theme = MISSION_STATUS_THEME[column.status]

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const payload = readMissionDragPayload(event.dataTransfer.getData('application/json'))
    if (!payload || payload.fromStatus === column.status) return
    onDrop(payload.missionId, column.status)
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        'flex w-72 shrink-0 flex-col gap-2.5 rounded-xl border p-3 shadow-sm backdrop-blur-sm',
        theme.columnBorder,
        theme.columnBg,
      )}
    >
      <div className="flex items-center gap-2 px-1">
        <span className={cn('size-2 shrink-0 rounded-full', theme.dot)} aria-hidden />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">{column.label}</span>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums', theme.countBadge)}>
          {column.cards.length}
        </span>
      </div>
      {column.cards.map((card) => (
        <MissionKanbanCardView key={card.missionId} card={card} />
      ))}
      {column.cards.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 px-3 py-5 text-center text-xs text-fg-muted">
          Glissez une mission ici
        </p>
      ) : null}
    </div>
  )
}
