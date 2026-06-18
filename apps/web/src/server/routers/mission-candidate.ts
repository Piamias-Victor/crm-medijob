import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { missionCandidateRepository } from '@/server/db/repositories/mission-candidate.repository'

const updateStageInput = z.object({
  missionId: z.string().min(1),
  candidateId: z.string().min(1),
  stageId: z.string().min(1),
})

export type UpdateStageInput = z.infer<typeof updateStageInput>

export type MissionCandidateDeps = {
  updateStage: (input: UpdateStageInput) => Promise<unknown>
}

export function makeMissionCandidateRouter(deps: MissionCandidateDeps) {
  return router({
    updateStage: protectedProcedure
      .input(updateStageInput)
      .mutation(({ input }) => deps.updateStage(input)),
  })
}

export const missionCandidateRouter = makeMissionCandidateRouter({
  updateStage: (input) => missionCandidateRepository.updateStage(input),
})
