import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { missionCandidateRepository } from '@/server/db/repositories/mission-candidate.repository'
import { transitionMissionStatus } from '@/server/mission/transition-status'

const PLACE_STAGE = 'Placé'
const REJECT_STAGE = 'Pas retenu'

async function findStageIdsByNames() {
  const stages = await pipelineStageRepository.list()
  const placé = stages.find((s) => s.name === PLACE_STAGE)?.id
  const pasRetenu = stages.find((s) => s.name === REJECT_STAGE)?.id
  if (!placé || !pasRetenu) throw new Error('Pipeline terminal stages missing')
  return { placé, pasRetenu }
}

export function runMissionStatusTransition(
  input: Parameters<typeof transitionMissionStatus>[0],
) {
  return transitionMissionStatus(input, {
    findStageIdsByNames,
    listCandidateIds: async (missionId) => {
      const rows = await missionCandidateRepository.listByMission(missionId)
      return rows.map((r) => r.candidateId)
    },
    updateMissionStatus: (missionId, status) => missionRepository.updateStatus(missionId, status),
    updateStage: (missionId, candidateId, stageId) =>
      missionCandidateRepository.updateStage({ missionId, candidateId, stageId }).then(() => undefined),
  })
}
