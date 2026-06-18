import { z } from 'zod'
import { router, protectedProcedure } from '@/server/trpc'
import { missionCandidateRepository } from '@/server/db/repositories/mission-candidate.repository'

const updateStageInput = z.object({
  missionId: z.string().min(1),
  candidateId: z.string().min(1),
  stageId: z.string().min(1),
})

export const missionCandidateRouter = router({
  updateStage: protectedProcedure
    .input(updateStageInput)
    .mutation(({ input }) => missionCandidateRepository.updateStage(input)),
})
