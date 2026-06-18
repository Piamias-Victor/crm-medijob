import type { MissionStatus } from '@prisma/client'
import type { RawCandidate, RawStage } from './candidate-kanban.types'

export const stages: RawStage[] = [
  { id: 's1', name: 'Nouveau', position: 0 },
  { id: 's2', name: 'Contacté', position: 1 },
  { id: 's3', name: 'Placé', position: 4 },
]

export function row(
  missionId: string,
  stage: RawStage,
  status: MissionStatus = 'A_POURVOIR',
) {
  return {
    stageId: stage.id,
    stage,
    mission: { id: missionId, title: `Mission ${missionId}`, status },
  }
}

export function candidate(over: Partial<RawCandidate> = {}): RawCandidate {
  return {
    id: 'c1',
    firstName: 'Alice',
    lastName: 'Martin',
    city: 'Lyon',
    jobTitle: { name: 'Pharmacien' },
    referent: { name: 'Bob Réf' },
    missions: [],
    ...over,
  }
}
