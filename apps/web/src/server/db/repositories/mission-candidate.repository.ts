import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

type UpdateStageInput = {
  missionId: string
  candidateId: string
  stageId: string
}

export function makeMissionCandidateRepository(db: PrismaClient = defaultDb) {
  return {
    listByMission: (missionId: string) =>
      db.missionCandidate.findMany({
        where: { missionId },
        select: { candidateId: true },
      }),
    updateStage: ({ missionId, candidateId, stageId }: UpdateStageInput) =>
      db.missionCandidate.update({
        where: { missionId_candidateId: { missionId, candidateId } },
        data: { stageId },
      }),
  }
}

export const missionCandidateRepository = makeMissionCandidateRepository()
