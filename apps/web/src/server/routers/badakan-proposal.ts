import { z } from 'zod'
import { BadakanProposalStatus } from '@prisma/client'
import { router, protectedProcedure } from '@/server/trpc'
import { badakanMissionProposalRepository } from '@/server/db/repositories/badakan-mission-proposal.repository'
import {
  toBadakanProposalListItem,
  type BadakanProposalSource,
} from '@/view-models/badakan-proposal-list'
import {
  toCandidateBadakanMissionItem,
  type CandidateBadakanProposalSource,
} from '@/view-models/candidate-badakan-missions'

const proposeInput = z.object({
  missionId: z.string().min(1),
  candidateId: z.string().min(1),
  score: z.number().int().min(0).max(100).optional(),
  justification: z.string().max(2000).optional(),
})

const keyInput = z.object({
  missionId: z.string().min(1),
  candidateId: z.string().min(1),
})

const statusInput = keyInput.extend({
  status: z.nativeEnum(BadakanProposalStatus),
})

export type BadakanProposalDeps = {
  propose: (input: z.infer<typeof proposeInput>) => Promise<BadakanProposalSource>
  listByMission: (missionId: string) => Promise<BadakanProposalSource[]>
  listByCandidate: (candidateId: string) => Promise<CandidateBadakanProposalSource[]>
  setStatus: (input: z.infer<typeof statusInput>) => Promise<BadakanProposalSource>
  remove: (input: z.infer<typeof keyInput>) => Promise<unknown>
}

export function makeBadakanProposalRouter(deps: BadakanProposalDeps) {
  return router({
    propose: protectedProcedure.input(proposeInput).mutation(async ({ input }) => {
      return toBadakanProposalListItem(await deps.propose(input))
    }),
    listByMission: protectedProcedure
      .input(z.object({ missionId: z.string().min(1) }))
      .query(async ({ input }) => {
        return (await deps.listByMission(input.missionId)).map(toBadakanProposalListItem)
      }),
    listByCandidate: protectedProcedure
      .input(z.object({ candidateId: z.string().min(1) }))
      .query(async ({ input }) => {
        return (await deps.listByCandidate(input.candidateId)).map(toCandidateBadakanMissionItem)
      }),
    setStatus: protectedProcedure.input(statusInput).mutation(async ({ input }) => {
      return toBadakanProposalListItem(await deps.setStatus(input))
    }),
    remove: protectedProcedure.input(keyInput).mutation(({ input }) => deps.remove(input)),
  })
}

export const badakanProposalRouter = makeBadakanProposalRouter({
  propose: (input) => badakanMissionProposalRepository.propose(input),
  listByMission: (missionId) => badakanMissionProposalRepository.listByMission(missionId),
  listByCandidate: (candidateId) => badakanMissionProposalRepository.listByCandidate(candidateId),
  setStatus: (input) => badakanMissionProposalRepository.setStatus(input),
  remove: (input) => badakanMissionProposalRepository.remove(input),
})
