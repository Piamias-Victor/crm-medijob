'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { CandidateMissionKanbanColumn } from '@/components/molecules/CandidateMissionKanbanColumn'
import { trpc } from '@/lib/trpc/client'
import {
  buildCandidateMissionKanban,
  moveCandidateMission,
  type CandidateMissionRow,
} from '@/view-models/candidate-missions'
import type { RawStage } from '@/view-models/candidate-kanban.types'

type Props = {
  candidateId: string
  stages: RawStage[]
  missions: CandidateMissionRow[]
}

export function CandidateMissionsKanban({ candidateId, stages, missions: initial }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState(initial)
  const columns = useMemo(() => buildCandidateMissionKanban(stages, rows), [stages, rows])
  const mutation = trpc.missionCandidate.updateStage.useMutation({
    onSettled: () => router.refresh(),
  })

  function move(missionId: string, rowCandidateId: string, stageId: string) {
    const targetStage = stages.find((stage) => stage.id === stageId)
    if (!targetStage) return
    setRows((prev) => moveCandidateMission(prev, { missionId, targetStage }))
    mutation.mutate({ missionId, candidateId: rowCandidateId, stageId })
  }

  if (stages.length === 0) {
    return <EmptyState icon={LayoutGrid} title="Aucune étape de pipeline configurée" />
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="Aucune mission active"
        description="Les missions actives sur lesquelles ce candidat est positionné apparaîtront ici."
      />
    )
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <CandidateMissionKanbanColumn
          key={column.stage.id}
          column={column}
          candidateId={candidateId}
          onDropRow={move}
        />
      ))}
    </div>
  )
}
