import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import { softwareRepository } from '@/server/db/repositories/software.repository'
import { userRepository } from '@/server/db/repositories/user.repository'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import {
  candidateIdSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
import { toCandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import { toCandidateUpdateData } from '@/view-models/candidate-profile-map'

export type CandidateDeps = {
  listForKanban: () => Promise<RawCandidate[]>
  listStages: () => Promise<RawStage[]>
  findProfileById: (id: string) => ReturnType<typeof candidateRepository.findProfileById>
  updateProfile: (
    id: string,
    data: Parameters<typeof candidateRepository.updateProfile>[1],
  ) => ReturnType<typeof candidateRepository.updateProfile>
  listJobTitles: () => ReturnType<typeof jobTitleRepository.list>
  listSoftwares: () => ReturnType<typeof softwareRepository.list>
  listRecruiters: () => ReturnType<typeof userRepository.listRecruiters>
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
    getById: protectedProcedure.input(candidateIdSchema).query(async ({ input }) => {
      const candidate = await deps.findProfileById(input.id)
      if (!candidate) return null
      return toCandidateProfilePayload(candidate)
    }),
    referentials: protectedProcedure.query(async () => ({
      jobTitles: await deps.listJobTitles(),
      softwares: await deps.listSoftwares(),
      recruiters: await deps.listRecruiters(),
      pipelineStages: await deps.listStages(),
    })),
    update: protectedProcedure.input(updateCandidateSchema).mutation(({ input }) =>
      deps.updateProfile(input.id, toCandidateUpdateData(input.data)),
    ),
  })
}

export const candidateRouter = makeCandidateRouter({
  listForKanban: () => candidateRepository.listForKanban(),
  listStages: () => pipelineStageRepository.list(),
  findProfileById: (id) => candidateRepository.findProfileById(id),
  updateProfile: (id, data) => candidateRepository.updateProfile(id, data),
  listJobTitles: () => jobTitleRepository.list(),
  listSoftwares: () => softwareRepository.list(),
  listRecruiters: () => userRepository.listRecruiters(),
})
