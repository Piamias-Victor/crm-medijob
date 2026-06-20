'use client'

import { useMemo } from 'react'
import { LayoutGrid } from 'lucide-react'
import type { MissionStatus } from '@prisma/client'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionPipelineColumn } from '@/components/molecules/MissionPipelineColumn'
import { useMissionPipelineMutations } from '@/lib/hooks/use-mission-pipeline-mutations'
import { buildMissionPipelineColumns } from '@/view-models/mission-pipeline'
import type { PipelineCandidateRow, PipelineStageRef } from '@/view-models/mission-pipeline.types'

type Props = {
  missionId: string
  status: MissionStatus
  rows: PipelineCandidateRow[]
  onRowsChange: (rows: PipelineCandidateRow[]) => void
  stages: PipelineStageRef[]
}

export function MissionPipelineKanban(props: Props) {
  const columns = useMemo(
    () => buildMissionPipelineColumns(props.stages, props.rows),
    [props.stages, props.rows],
  )
  const { busy, move, handleRemove } = useMissionPipelineMutations(props)

  if (props.stages.length === 0) {
    return <EmptyState icon={LayoutGrid} title="Aucune étape de pipeline configurée" />
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <MissionPipelineColumn
          key={column.stage.id}
          missionId={props.missionId}
          column={column}
          busy={busy}
          onDropRow={move}
          onRemove={handleRemove}
        />
      ))}
    </div>
  )
}
