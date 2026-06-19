'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { KanbanColumn } from '@/components/molecules/KanbanColumn'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
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
  const toast = useEntityMutation()
  const mutation = trpc.missionCandidate.updateStage.useMutation({
    onSettled: () => router.refresh(),
  })

  function move(missionId: string, candidateId: string, stageId: string) {
    const targetStage = stages.find((stage) => stage.id === stageId)
    if (!targetStage) return
    const snapshot = rows
    setRows((prev) => moveMissionRow(prev, { missionId, candidateId, targetStage }))
    mutation.mutate(
      { missionId, candidateId, stageId },
      {
        onError: (error) => {
          toast.onError(error)
          setRows(snapshot)
        },
      },
    )
  }

  if (stages.length === 0) {
    return <EmptyState icon={LayoutGrid} title="Aucune étape de pipeline configurée" />
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <KanbanColumn key={column.stage.id} column={column} onDropRow={move} />
      ))}
    </div>
  )
}
