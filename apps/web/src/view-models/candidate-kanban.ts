import type { MissionStatus } from '@prisma/client'
import { isTerminalMissionStatus, isTerminalStageName } from '@/lib/kanban-terminal'
import type {
  CandidateListItem,
  KanbanColumn,
  RawCandidate,
  RawMissionRow,
  RawStage,
} from './candidate-kanban.types'

export type * from './candidate-kanban.types'

const fullName = (c: RawCandidate) => `${c.firstName} ${c.lastName}`.trim()

export function activeMissions(candidate: RawCandidate): RawMissionRow[] {
  return candidate.missions.filter(
    (row) => !isTerminalMissionStatus(row.mission.status) && !isTerminalStageName(row.stage.name),
  )
}

export function buildKanbanColumns(
  stages: RawStage[],
  candidates: RawCandidate[],
): KanbanColumn[] {
  const ordered = [...stages].sort((a, b) => a.position - b.position)
  return ordered.map((stage) => ({
    stage,
    cards: candidates.flatMap((candidate) => {
      const rows = activeMissions(candidate).filter((row) => row.stageId === stage.id)
      if (rows.length === 0) return []
      return [
        {
          candidateId: candidate.id,
          name: fullName(candidate),
          jobTitle: candidate.jobTitle?.name ?? null,
          city: candidate.city,
          referent: candidate.referent?.name ?? null,
          rows: rows.map((row) => ({
            missionId: row.mission.id,
            candidateId: candidate.id,
            title: row.mission.title,
            stageId: stage.id,
            stageName: stage.name,
          })),
        },
      ]
    }),
  }))
}

type MoveInput = { missionId: string; candidateId: string; targetStage: RawStage }

export function moveMissionRow(
  candidates: RawCandidate[],
  { missionId, candidateId, targetStage }: MoveInput,
): RawCandidate[] {
  return candidates.map((candidate) =>
    candidate.id !== candidateId
      ? candidate
      : {
          ...candidate,
          missions: candidate.missions.map((row) =>
            row.mission.id === missionId
              ? { ...row, stageId: targetStage.id, stage: targetStage }
              : row,
          ),
        },
  )
}

export function toListItems(candidates: RawCandidate[]): CandidateListItem[] {
  return candidates.map((candidate) => ({
    id: candidate.id,
    name: fullName(candidate),
    jobTitle: candidate.jobTitle?.name ?? null,
    city: candidate.city,
    referent: candidate.referent?.name ?? null,
    activeMissionCount: activeMissions(candidate).length,
  }))
}
