'use client'

import { type DragEvent } from 'react'
import { CandidateMissionCard } from '@/components/molecules/CandidateMissionCard'
import { readDragPayload } from '@/components/molecules/kanban-dnd'
import type { CandidateMissionKanbanColumn } from '@/view-models/candidate-missions'

type Props = {
  column: CandidateMissionKanbanColumn
  candidateId: string
  onDropRow: (missionId: string, candidateId: string, stageId: string) => void
}

export function CandidateMissionKanbanColumn({ column, candidateId, onDropRow }: Props) {
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
      className="flex w-72 shrink-0 flex-col gap-2 rounded-xl border border-border bg-surface/80 p-3"
    >
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-fg">{column.stage.name}</span>
        <span className="text-xs text-fg-muted">{column.missions.length}</span>
      </div>
      {column.missions.map((mission) => (
        <CandidateMissionCard key={mission.missionId} mission={mission} candidateId={candidateId} />
      ))}
    </div>
  )
}
