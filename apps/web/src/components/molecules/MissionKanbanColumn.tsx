'use client'

import { type DragEvent, useState } from 'react'
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
  const [over, setOver] = useState(false)
  const theme = MISSION_STATUS_THEME[column.status]

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setOver(false)
    const payload = readMissionDragPayload(event.dataTransfer.getData('application/json'))
    if (!payload || payload.fromStatus === column.status) return
    onDrop(payload.missionId, column.status)
  }

  return (
    <div
      className={cn(
        'flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm ring-1',
        theme.columnRing,
        over && 'ring-2',
      )}
    >
      <header className={cn('border-b border-border px-4 py-3', theme.header)}>
        <div className="flex items-center gap-2">
          <span className={cn('size-2.5 shrink-0 rounded-full shadow-sm', theme.dot)} />
          <span className="text-sm font-semibold tracking-tight text-fg">{column.label}</span>
          <span className="ml-auto rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-fg-muted shadow-sm">
            {column.cards.length}
          </span>
        </div>
      </header>
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={handleDrop}
        className={cn(
          'flex min-h-48 flex-1 flex-col gap-2 p-3 transition-colors',
          over && 'bg-surface/80',
        )}
      >
        {column.cards.map((card) => (
          <MissionKanbanCardView key={card.missionId} card={card} />
        ))}
        {column.cards.length === 0 ? (
          <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border/80 px-3 py-6 text-center text-xs text-fg-muted">
            Glissez une mission ici
          </p>
        ) : null}
      </div>
    </div>
  )
}
