'use client'

import { type DragEvent } from 'react'
import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { DND_MIME } from '@/components/molecules/kanban-dnd'
import type { MissionCard } from '@/view-models/candidate-kanban'

export function KanbanMissionRow({ row }: { row: MissionCard }) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData(
      DND_MIME,
      JSON.stringify({
        missionId: row.missionId,
        candidateId: row.candidateId,
        fromStageId: row.stageId,
      }),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex cursor-grab items-center gap-2 rounded-md border border-border bg-surface px-2 py-1.5 active:cursor-grabbing"
    >
      <GripVertical aria-hidden className="size-4 shrink-0 text-fg-muted" />
      <span className="flex-1 truncate text-xs text-fg">{row.title}</span>
      <Badge variant="accent">{row.stageName}</Badge>
    </div>
  )
}
