import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { proposalCandidateInclude } from './badakan-proposal-include'
import { proposeCandidate, removeProposal } from './badakan-proposal-propose-remove'
import { setProposalStatus } from './badakan-proposal-set-status'

export function makeBadakanMissionProposalRepository(db: PrismaClient = defaultDb) {
  return {
    propose: (input: {
      missionId: string
      candidateId: string
      score?: number
      justification?: string
    }) => proposeCandidate(db, input),
    listByMission: (missionId: string) =>
      db.badakanMissionProposal.findMany({
        where: { badakanMissionId: missionId },
        orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
        include: proposalCandidateInclude,
      }),
    listByCandidate: (candidateId: string) =>
      db.badakanMissionProposal.findMany({
        where: { candidateId, status: { in: ['PROPOSE', 'VALIDE'] } },
        orderBy: { updatedAt: 'desc' },
        include: {
          mission: {
            select: {
              id: true,
              pharmacyName: true,
              city: true,
              step: true,
              periods: true,
              jobTitle: { select: { name: true } },
              activityLabel: true,
            },
          },
        },
      }),
    setStatus: (input: Parameters<typeof setProposalStatus>[1]) => setProposalStatus(db, input),
    remove: (input: { missionId: string; candidateId: string }) => removeProposal(db, input),
  }
}

export const badakanMissionProposalRepository = makeBadakanMissionProposalRepository()
