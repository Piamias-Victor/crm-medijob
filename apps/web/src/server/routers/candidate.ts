import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

export type CandidateDeps = {
  listForKanban: () => Promise<RawCandidate[]>
  listStages: () => Promise<RawStage[]>
}

export function makeCandidateRouter(deps: CandidateDeps) {
  return router({
    cvtheque: protectedProcedure.query(async () => {
      const [candidates, stages] = await Promise.all([
        deps.listForKanban(),
        deps.listStages(),
      ])
      return { candidates, stages }
    }),
  })
}

export const candidateRouter = makeCandidateRouter({
  listForKanban: () => candidateRepository.listForKanban(),
  listStages: () => pipelineStageRepository.list(),
})
