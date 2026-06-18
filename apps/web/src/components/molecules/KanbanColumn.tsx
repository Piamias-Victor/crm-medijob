'use client'

import { type DragEvent } from 'react'
import { CandidateKanbanCard } from '@/components/molecules/CandidateKanbanCard'
import { readDragPayload } from '@/components/molecules/kanban-dnd'
import type { KanbanColumn as Column } from '@/view-models/candidate-kanban'

type Props = {
  column: Column
  onDropRow: (missionId: string, candidateId: string, stageId: string) => void
}

export function KanbanColumn({ column, onDropRow }: Props) {
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const payload = readDragPayload(event.dataTransfer.getData('application/json'))
    if (!payload || payload.fromStageId === column.stage.id) return
    onDropRow(payload.missionId, payload.candidateId, column.stage.id)
  }

  return (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      className="flex w-72 shrink-0 flex-col gap-2 rounded-lg bg-surface p-3"
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-fg">{column.stage.name}</span>
        <span className="text-xs text-fg-muted">{column.cards.length}</span>
      </div>
      {column.cards.map((card) => (
        <CandidateKanbanCard key={card.candidateId} card={card} />
      ))}
    </div>
  )
}
