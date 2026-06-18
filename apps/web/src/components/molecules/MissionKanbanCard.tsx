'use client'

import { type DragEvent, useState } from 'react'
import { Building2, GripVertical, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DND_MIME } from '@/components/molecules/kanban-dnd'
import { MISSION_STATUS_THEME } from '@/lib/mission-status-theme'
import type { MissionKanbanCard } from '@/view-models/mission-kanban'

export function MissionKanbanCardView({ card }: { card: MissionKanbanCard }) {
  const [dragging, setDragging] = useState(false)
  const theme = MISSION_STATUS_THEME[card.fromStatus]

  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData(
      DND_MIME,
      JSON.stringify({ missionId: card.missionId, fromStatus: card.fromStatus }),
    )
    event.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={() => setDragging(false)}
      className={cn(
        'cursor-grab rounded-lg border border-border border-l-4 bg-gradient-to-br p-3 shadow-sm transition-all',
        'hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing',
        theme.cardAccent,
        dragging && 'opacity-60 shadow-none',
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical aria-hidden className="mt-0.5 size-4 shrink-0 text-fg-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="truncate text-sm font-semibold tracking-tight text-fg">{card.title}</p>
          <div className="space-y-1">
            {card.jobTitle ? (
              <p className="truncate text-xs text-fg-muted">{card.jobTitle}</p>
            ) : null}
            <p className="flex items-center gap-1 truncate text-xs text-fg-muted">
              <Building2 aria-hidden className="size-3 shrink-0" />
              {card.pharmacyName}
            </p>
            {card.city || card.referent ? (
              <p className="flex items-center gap-1 truncate text-xs text-fg-muted">
                {card.referent ? (
                  <>
                    <UserRound aria-hidden className="size-3 shrink-0" />
                    {card.referent}
                  </>
                ) : null}
                {card.city ? <span>{card.referent ? ` · ${card.city}` : card.city}</span> : null}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
