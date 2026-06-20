import type { MissionStatus } from '@prisma/client'
import type { StageUpdate } from '@/server/mission/transition-status'

export type UpdateStageInput = {
  missionId: string
  candidateId: string
  stageId: string
}

export type MissionCandidateServiceDeps = {
  updateStage: (input: UpdateStageInput) => Promise<unknown>
  applyTerminalTransition: (
    missionId: string,
    status: MissionStatus,
    stageUpdates: StageUpdate[],
  ) => Promise<{ id: string; status: MissionStatus }>
}

export async function updateStage(
  input: UpdateStageInput,
  deps: Pick<MissionCandidateServiceDeps, 'updateStage'>,
) {
  return deps.updateStage(input)
}

export async function applyTerminalTransition(
  missionId: string,
  status: MissionStatus,
  stageUpdates: StageUpdate[],
  deps: Pick<MissionCandidateServiceDeps, 'applyTerminalTransition'>,
) {
  return deps.applyTerminalTransition(missionId, status, stageUpdates)
}
