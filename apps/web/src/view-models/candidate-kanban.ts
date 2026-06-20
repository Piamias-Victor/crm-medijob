import { filterActivePositionings } from '@/lib/kanban-active-positionings'
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
  return filterActivePositionings(candidate.missions)
}

export function buildKanbanColumns(
  stages: RawStage[],
  candidates: RawCandidate[],
): KanbanColumn[] {
  const ordered = [...stages].sort((a, b) => a.position - b.position)
  const cardsByStage = new Map(ordered.map((stage) => [stage.id, [] as KanbanColumn['cards']]))

  for (const candidate of candidates) {
    const rowsByStage = new Map<string, RawMissionRow[]>()
    for (const row of activeMissions(candidate)) {
      const bucket = rowsByStage.get(row.stageId) ?? []
      bucket.push(row)
      rowsByStage.set(row.stageId, bucket)
    }
    for (const [stageId, rows] of rowsByStage) {
      const cards = cardsByStage.get(stageId)
      if (!cards) continue
      cards.push({
        candidateId: candidate.id,
        name: fullName(candidate),
        jobTitle: candidate.jobTitle?.name ?? null,
        city: candidate.city,
        referent: candidate.referent?.name ?? null,
        rows: rows.map((row) => ({
          missionId: row.mission.id,
          candidateId: candidate.id,
          title: row.mission.title,
          stageId,
          stageName: row.stage.name,
        })),
      })
    }
  }

  return ordered.map((stage) => ({ stage, cards: cardsByStage.get(stage.id) ?? [] }))
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
