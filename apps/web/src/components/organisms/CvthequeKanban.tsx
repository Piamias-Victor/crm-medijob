'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { KanbanColumn } from '@/components/molecules/KanbanColumn'
import { trpc } from '@/lib/trpc/client'
import { useKanbanOptimisticMutation } from '@/lib/hooks/use-kanban-optimistic-mutation'
import {
  buildKanbanColumns,
  moveMissionRow,
  type RawCandidate,
  type RawStage,
} from '@/view-models/candidate-kanban'

type Props = { candidates: RawCandidate[]; stages: RawStage[] }

export function CvthequeKanban({ candidates, stages }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState(candidates)
  const columns = useMemo(() => buildKanbanColumns(stages, rows), [stages, rows])
  const mutation = trpc.missionCandidate.updateStage.useMutation({
    onSettled: () => router.refresh(),
  })
  const move = useKanbanOptimisticMutation({
    rows,
    setRows,
    applyOptimistic: (prev, vars: { missionId: string; candidateId: string; stageId: string }) => {
      const targetStage = stages.find((stage) => stage.id === vars.stageId)
      return targetStage ? moveMissionRow(prev, { missionId: vars.missionId, candidateId: vars.candidateId, targetStage }) : prev
    },
    mutate: mutation.mutate,
  })

  if (stages.length === 0) {
    return <EmptyState icon={LayoutGrid} title="Aucune étape de pipeline configurée" />
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <KanbanColumn
          key={column.stage.id}
          column={column}
          onDropRow={(missionId, candidateId, stageId) => move({ missionId, candidateId, stageId })}
        />
      ))}
    </div>
  )
}
