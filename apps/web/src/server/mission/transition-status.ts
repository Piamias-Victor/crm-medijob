import type { MissionStatus } from '@prisma/client'
import { TransitionError } from '@/server/mission/transition-errors'

export type TransitionInput = {
  missionId: string
  status: MissionStatus
  placedCandidateId?: string
}

export type StageUpdate = { candidateId: string; stageId: string }

export type TransitionDeps = {
  findStageIdsByNames: () => Promise<{ placé: string; pasRetenu: string }>
  listCandidateIds: (missionId: string) => Promise<string[]>
  updateMissionStatus: (missionId: string, status: MissionStatus) => Promise<{ id: string; status: MissionStatus }>
  applyTerminalTransition: (
    missionId: string,
    status: MissionStatus,
    stageUpdates: StageUpdate[],
  ) => Promise<{ id: string; status: MissionStatus }>
}

export async function transitionMissionStatus(input: TransitionInput, deps: TransitionDeps) {
  if (input.status !== 'POURVU' && input.status !== 'ANNULEE') {
    return deps.updateMissionStatus(input.missionId, input.status)
  }

  const stages = await deps.findStageIdsByNames()
  const candidateIds = await deps.listCandidateIds(input.missionId)

  if (input.status === 'POURVU') {
    if (!input.placedCandidateId || !candidateIds.includes(input.placedCandidateId)) {
      throw new TransitionError('INVALID_PLACED_CANDIDATE')
    }
  }

  const stageUpdates = candidateIds.map((candidateId) => ({
    candidateId,
    stageId:
      input.status === 'POURVU' && candidateId === input.placedCandidateId
        ? stages.placé
        : stages.pasRetenu,
  }))

  return deps.applyTerminalTransition(input.missionId, input.status, stageUpdates)
}
