import type { PrismaClient } from '@prisma/client'
import {
  holdCandidateSlotsOnMission,
  restoreCandidateSlotsOnMission,
} from './proposal-held-slots'
import { proposalCandidateInclude } from './badakan-proposal-include'

export async function proposeCandidate(
  db: PrismaClient,
  input: { missionId: string; candidateId: string; score?: number; justification?: string },
) {
  const row = await db.badakanMissionProposal.upsert({
    where: {
      badakanMissionId_candidateId: {
        badakanMissionId: input.missionId,
        candidateId: input.candidateId,
      },
    },
    create: {
      badakanMissionId: input.missionId,
      candidateId: input.candidateId,
      status: 'PROPOSE',
      score: input.score ?? null,
      justification: input.justification ?? null,
    },
    update: {
      status: 'PROPOSE',
      score: input.score ?? null,
      justification: input.justification ?? null,
    },
    include: proposalCandidateInclude,
  })
  await holdCandidateSlotsOnMission(db, input.candidateId, input.missionId)
  return row
}

export async function removeProposal(
  db: PrismaClient,
  input: { missionId: string; candidateId: string },
) {
  const existing = await db.badakanMissionProposal.findUnique({
    where: {
      badakanMissionId_candidateId: {
        badakanMissionId: input.missionId,
        candidateId: input.candidateId,
      },
    },
  })
  if (!existing) return null
  await db.badakanMissionProposal.delete({
    where: {
      badakanMissionId_candidateId: {
        badakanMissionId: input.missionId,
        candidateId: input.candidateId,
      },
    },
  })
  await restoreCandidateSlotsOnMission(db, input.candidateId, input.missionId)
  if (existing.status === 'VALIDE') {
    await db.badakanMission.update({
      where: { id: input.missionId },
      data: { step: 'CREATED', staffedRecipients: 0 },
    })
  }
  return existing
}
