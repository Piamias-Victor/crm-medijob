import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'

export const candidateRouter = router({
  cvtheque: protectedProcedure.query(async () => {
    const [candidates, stages] = await Promise.all([
      candidateRepository.listForKanban(),
      pipelineStageRepository.list(),
    ])
    return { candidates, stages }
  }),
})
