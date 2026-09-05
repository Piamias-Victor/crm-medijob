import type { BadakanProposalStatus, PrismaClient } from '@prisma/client'
import { restoreCandidateSlotsOnMission } from './proposal-held-slots'
import { proposalCandidateInclude } from './badakan-proposal-include'

export async function setProposalStatus(
  db: PrismaClient,
  input: { missionId: string; candidateId: string; status: BadakanProposalStatus },
) {
  const row = await db.badakanMissionProposal.update({
    where: {
      badakanMissionId_candidateId: {
        badakanMissionId: input.missionId,
        candidateId: input.candidateId,
      },
    },
    data: { status: input.status },
    include: proposalCandidateInclude,
  })
  if (input.status === 'VALIDE') {
    const others = await db.badakanMissionProposal.findMany({
      where: {
        badakanMissionId: input.missionId,
        candidateId: { not: input.candidateId },
        status: 'PROPOSE',
      },
      select: { candidateId: true },
    })
    for (const other of others) {
      await restoreCandidateSlotsOnMission(db, other.candidateId, input.missionId)
    }
    const mission = await db.badakanMission.findUnique({
      where: { id: input.missionId },
      select: { expectedRecipients: true },
    })
    if (mission) {
      await db.badakanMission.update({
        where: { id: input.missionId },
        data: {
          step: 'STAFFED',
          staffedRecipients: Math.max(mission.expectedRecipients, 1),
        },
      })
    }
  }
  if (input.status === 'REFUSE') {
    await restoreCandidateSlotsOnMission(db, input.candidateId, input.missionId)
  }
  return row
}
