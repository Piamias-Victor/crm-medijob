import type { MissionStatus } from '@prisma/client'

export type TransitionInput = {
  missionId: string
  status: MissionStatus
  placedCandidateId?: string
}

export type TransitionDeps = {
  findStageIdsByNames: () => Promise<{ placé: string; pasRetenu: string }>
  listCandidateIds: (missionId: string) => Promise<string[]>
  updateMissionStatus: (missionId: string, status: MissionStatus) => Promise<{ id: string; status: MissionStatus }>
  updateStage: (missionId: string, candidateId: string, stageId: string) => Promise<void>
}

export async function transitionMissionStatus(input: TransitionInput, deps: TransitionDeps) {
  const result = await deps.updateMissionStatus(input.missionId, input.status)

  if (input.status !== 'POURVU' && input.status !== 'ANNULEE') return result

  const stages = await deps.findStageIdsByNames()
  const candidateIds = await deps.listCandidateIds(input.missionId)

  await Promise.all(
    candidateIds.map((candidateId) => {
      const stageId =
        input.status === 'POURVU' && candidateId === input.placedCandidateId
          ? stages.placé
          : stages.pasRetenu
      return deps.updateStage(input.missionId, candidateId, stageId)
    }),
  )

  return result
}
