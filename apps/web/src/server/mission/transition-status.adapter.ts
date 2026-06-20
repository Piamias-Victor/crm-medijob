import { TRPCError } from '@trpc/server'
import { TERMINAL_STAGE_NAMES } from '@/lib/pipeline-constants'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { missionRepository } from '@/server/db/repositories/mission.repository'
import { missionCandidateRepository } from '@/server/db/repositories/mission-candidate.repository'
import { transitionMissionStatus } from '@/server/mission/transition-status'
import { applyTerminalTransition } from '@/server/pipeline/mission-candidate.service'
import { TransitionError } from '@/server/mission/transition-errors'

async function findStageIdsByNames() {
  const stages = await pipelineStageRepository.list()
  const placé = stages.find((s) => s.name === TERMINAL_STAGE_NAMES[0])?.id
  const pasRetenu = stages.find((s) => s.name === TERMINAL_STAGE_NAMES[1])?.id
  if (!placé || !pasRetenu) throw new TransitionError('MISSING_TERMINAL_STAGES')
  return { placé, pasRetenu }
}

function mapTransitionError(error: unknown): never {
  if (error instanceof TransitionError) {
    if (error.code === 'INVALID_PLACED_CANDIDATE') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'placedCandidateId must belong to the mission',
      })
    }
    throw new TRPCError({
      code: 'PRECONDITION_FAILED',
      message: 'Pipeline terminal stages missing',
    })
  }
  throw error
}

export async function runMissionStatusTransition(
  input: Parameters<typeof transitionMissionStatus>[0],
) {
  try {
    return await transitionMissionStatus(input, {
      findStageIdsByNames,
      listCandidateIds: async (missionId) => {
        const rows = await missionCandidateRepository.listByMission(missionId)
        return rows.map((r) => r.candidateId)
      },
      updateMissionStatus: (missionId, status) => missionRepository.updateStatus(missionId, status),
      applyTerminalTransition: (missionId, status, stageUpdates) =>
        applyTerminalTransition(missionId, status, stageUpdates, {
          applyTerminalTransition: (id, nextStatus, updates) =>
            missionCandidateRepository.applyTerminalTransition(id, nextStatus, updates),
        }),
    })
  } catch (error) {
    mapTransitionError(error)
  }
}
