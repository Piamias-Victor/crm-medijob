import type { MissionStatus } from '@prisma/client'
import { filterActivePositionings } from '@/lib/kanban-active-positionings'

export type RawCandidateMissionRow = {
  stage: { id: string; name: string; position: number }
  mission: { id: string; title: string; status: MissionStatus }
}

export type CandidateMissionRow = {
  missionId: string
  missionTitle: string
  stageId: string
  stageName: string
}

export type CandidateMissionKanbanColumn = {
  stage: { id: string; name: string; position: number }
  missions: CandidateMissionRow[]
}

export function buildCandidateMissionKanban(
  stages: { id: string; name: string; position: number }[],
  missions: CandidateMissionRow[],
): CandidateMissionKanbanColumn[] {
  const sorted = [...stages].sort((a, b) => a.position - b.position)
  return sorted.map((stage) => ({
    stage,
    missions: missions.filter((m) => m.stageId === stage.id),
  }))
}

export function moveCandidateMission(
  missions: CandidateMissionRow[],
  payload: { missionId: string; targetStage: { id: string; name: string } },
): CandidateMissionRow[] {
  return missions.map((row) =>
    row.missionId === payload.missionId
      ? { ...row, stageId: payload.targetStage.id, stageName: payload.targetStage.name }
      : row,
  )
}

const toMissionRow = (row: RawCandidateMissionRow): CandidateMissionRow => ({
  missionId: row.mission.id,
  missionTitle: row.mission.title,
  stageId: row.stage.id,
  stageName: row.stage.name,
})

export function toCandidateMissionRows(rows: RawCandidateMissionRow[]): CandidateMissionRow[] {
  return filterActivePositionings(rows).map(toMissionRow)
}
