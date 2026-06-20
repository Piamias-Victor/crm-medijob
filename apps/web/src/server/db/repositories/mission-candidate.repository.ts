import type { PrismaClient } from '@prisma/client'
import { DEFAULT_PIPELINE_STAGE_NAME } from '@/lib/pipeline-constants'
import { NOT_DELETED } from './soft-delete'
import { prisma as defaultDb } from './client'

type MissionCandidateKey = { missionId: string; candidateId: string }

type UpdateStageInput = MissionCandidateKey & { stageId: string }

export function makeMissionCandidateRepository(db: PrismaClient = defaultDb) {
  return {
    listByMission: (missionId: string) =>
      db.missionCandidate.findMany({
        where: { missionId },
        select: {
          candidateId: true,
          stageId: true,
          stage: { select: { id: true, name: true, position: true } },
          candidate: {
        select: {
          firstName: true,
          lastName: true,
          city: true,
          postalCode: true,
          jobTitle: { select: { name: true } },
          referent: { select: { name: true } },
        },
      },
        },
      }),
    updateStage: ({ missionId, candidateId, stageId }: UpdateStageInput) =>
      db.missionCandidate.update({
        where: { missionId_candidateId: { missionId, candidateId } },
        data: { stageId },
      }),
    createAtDefaultStage: async ({ missionId, candidateId }: MissionCandidateKey) => {
      const candidate = await db.candidate.findFirst({
        where: { id: candidateId, ...NOT_DELETED },
        select: { id: true },
      })
      if (!candidate) return null

      const stage = await db.pipelineStage.findFirst({
        where: { name: DEFAULT_PIPELINE_STAGE_NAME },
        select: { id: true },
      })
      if (!stage) return null

      const existing = await db.missionCandidate.findUnique({
        where: { missionId_candidateId: { missionId, candidateId } },
        select: { candidateId: true },
      })
      if (existing) return 'duplicate' as const

      return db.missionCandidate.create({
        data: { missionId, candidateId, stageId: stage.id },
      })
    },
    remove: ({ missionId, candidateId }: MissionCandidateKey) =>
      db.missionCandidate.delete({
        where: { missionId_candidateId: { missionId, candidateId } },
      }),
  }
}

export const missionCandidateRepository = makeMissionCandidateRepository()
