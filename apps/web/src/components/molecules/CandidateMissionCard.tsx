'use client'

import { type DragEvent } from 'react'
import { GripVertical } from 'lucide-react'
import { DND_MIME } from '@/components/molecules/kanban-dnd'
import type { CandidateMissionRow } from '@/view-models/candidate-missions'

type Props = { mission: CandidateMissionRow; candidateId: string }

export function CandidateMissionCard({ mission, candidateId }: Props) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData(
      DND_MIME,
      JSON.stringify({
        missionId: mission.missionId,
        candidateId,
        fromStageId: mission.stageId,
      }),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex cursor-grab items-center gap-2 rounded-xl border border-border/55 bg-white/92 px-3 py-2.5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent/45 hover:shadow-md hover:shadow-accent/8 active:cursor-grabbing"
    >
      <GripVertical aria-hidden className="size-4 shrink-0 text-fg-muted" />
      <span className="flex-1 truncate text-sm font-medium text-fg">{mission.missionTitle}</span>
    </div>
  )
}
