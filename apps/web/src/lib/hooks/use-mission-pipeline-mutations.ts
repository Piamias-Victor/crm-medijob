'use client'

import { useRouter } from 'next/navigation'
import type { MissionStatus } from '@prisma/client'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { TERMINAL_STAGE_NAMES } from '@/lib/pipeline-constants'
import { movePipelineCandidate } from '@/view-models/mission-pipeline'
import type { PipelineCandidateRow, PipelineStageRef } from '@/view-models/mission-pipeline.types'

type Args = {
  missionId: string
  status: MissionStatus
  rows: PipelineCandidateRow[]
  onRowsChange: (rows: PipelineCandidateRow[]) => void
  stages: PipelineStageRef[]
}

export function useMissionPipelineMutations({
  missionId,
  rows,
  onRowsChange,
  stages,
}: Args) {
  const router = useRouter()
  const toast = useEntityMutation({ onSuccess: () => router.refresh() })
  const updateStage = trpc.missionCandidate.updateStage.useMutation()
  const remove = trpc.missionCandidate.remove.useMutation()
  const markPourvu = trpc.mission.markPourvu.useMutation()
  const busy = updateStage.isPending || remove.isPending || markPourvu.isPending

  function markPlaced(candidateId: string) {
    markPourvu.mutate(
      { id: missionId, placedCandidateId: candidateId },
      {
        onSuccess: () => {
          toast.onSuccess()
          onRowsChange([])
        },
        onError: toast.onError,
      },
    )
  }

  function move(candidateId: string, stageId: string) {
    const targetStage = stages.find((stage) => stage.id === stageId)
    if (!targetStage) return

    if (targetStage.name === TERMINAL_STAGE_NAMES[0]) {
      markPlaced(candidateId)
      return
    }

    const snapshot = rows
    onRowsChange(movePipelineCandidate(rows, { candidateId, targetStage }))
    updateStage.mutate(
      { missionId, candidateId, stageId },
      { onError: (error) => { toast.onError(error); onRowsChange(snapshot) } },
    )
  }

  function handleRemove(candidateId: string) {
    const snapshot = rows
    onRowsChange(rows.filter((row) => row.candidateId !== candidateId))
    remove.mutate(
      { missionId, candidateId },
      { onError: (error) => { toast.onError(error); onRowsChange(snapshot) } },
    )
  }

  return { busy, move, handleRemove }
}
