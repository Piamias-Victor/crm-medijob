import { isTerminalStageName } from '@/lib/kanban-terminal'
import type {
  MissionPipelineColumn,
  PipelineCandidateRow,
  PipelineStageRef,
} from '@/view-models/mission-pipeline.types'

export type * from '@/view-models/mission-pipeline.types'

function activeCandidates(rows: PipelineCandidateRow[]) {
  return rows.filter((row) => !isTerminalStageName(row.stageName))
}

export function buildMissionPipelineColumns(
  stages: PipelineStageRef[],
  candidates: PipelineCandidateRow[],
): MissionPipelineColumn[] {
  const ordered = [...stages].sort((a, b) => a.position - b.position)
  const visible = activeCandidates(candidates)

  return ordered.map((stage) => ({
    stage,
    cards: visible.filter((row) => row.stageId === stage.id),
  }))
}

type MoveInput = { candidateId: string; targetStage: PipelineStageRef }

export function movePipelineCandidate(
  candidates: PipelineCandidateRow[],
  { candidateId, targetStage }: MoveInput,
): PipelineCandidateRow[] {
  return candidates.map((row) =>
    row.candidateId !== candidateId
      ? row
      : { ...row, stageId: targetStage.id, stageName: targetStage.name },
  )
}
