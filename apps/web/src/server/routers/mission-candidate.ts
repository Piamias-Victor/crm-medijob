import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, protectedProcedure } from '@/server/trpc'
import { missionCandidateRepository } from '@/server/db/repositories/mission-candidate.repository'
import { entityNotFound } from '@/server/trpc/entity-errors'

const missionCandidateKey = z.object({
  missionId: z.string().min(1),
  candidateId: z.string().min(1),
})

const updateStageInput = missionCandidateKey.extend({
  stageId: z.string().min(1),
})

export type UpdateStageInput = z.infer<typeof updateStageInput>
export type PositionInput = z.infer<typeof missionCandidateKey>
export type RemoveInput = z.infer<typeof missionCandidateKey>

export type MissionCandidateDeps = {
  updateStage: (input: UpdateStageInput) => Promise<unknown>
  position: (input: PositionInput) => Promise<unknown | null | 'duplicate'>
  remove: (input: RemoveInput) => Promise<unknown>
}

export function makeMissionCandidateRouter(deps: MissionCandidateDeps) {
  return router({
    updateStage: protectedProcedure
      .input(updateStageInput)
      .mutation(({ input }) => deps.updateStage(input)),
    position: protectedProcedure.input(missionCandidateKey).mutation(async ({ input }) => {
      const result = await deps.position(input)
      if (result === 'duplicate') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Ce candidat est déjà positionné sur cette mission.',
        })
      }
      if (!result) throw entityNotFound('Candidat')
      return result
    }),
    remove: protectedProcedure
      .input(missionCandidateKey)
      .mutation(({ input }) => deps.remove(input)),
  })
}

export const missionCandidateRouter = makeMissionCandidateRouter({
  updateStage: (input) => missionCandidateRepository.updateStage(input),
  position: (input) => missionCandidateRepository.createAtDefaultStage(input),
  remove: (input) => missionCandidateRepository.remove(input),
})
