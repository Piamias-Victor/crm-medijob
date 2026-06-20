'use client'

import { type DragEvent } from 'react'
import { cn } from '@/lib/cn'
import { MissionPipelineCard } from '@/components/molecules/MissionPipelineCard'
import { readDragPayload } from '@/components/molecules/kanban-dnd'
import { pipelineStageTheme } from '@/view-models/pipeline-stage-theme'
import type { MissionPipelineColumn as Column } from '@/view-models/mission-pipeline.types'

type Props = {
  missionId: string
  column: Column
  busy: boolean
  onDropRow: (candidateId: string, stageId: string) => void
  onRemove: (candidateId: string) => void
}

export function MissionPipelineColumn({
  missionId,
  column,
  busy,
  onDropRow,
  onRemove,
}: Props) {
  const theme = pipelineStageTheme(column.stage.position)

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    const payload = readDragPayload(event.dataTransfer.getData('application/json'))
    if (!payload || payload.fromStageId === column.stage.id) return
    onDropRow(payload.candidateId, column.stage.id)
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
        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-fg">
          {column.stage.name}
        </span>
        <span className={cn('rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums', theme.badge)}>
          {column.cards.length}
        </span>
      </div>
      {column.cards.map((card) => (
        <MissionPipelineCard
          key={card.candidateId}
          missionId={missionId}
          card={card}
          busy={busy}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
