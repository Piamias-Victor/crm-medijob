import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { pipelineStageRepository } from '@/server/db/repositories/pipeline-stage.repository'
import { jobTitleRepository } from '@/server/db/repositories/job-title.repository'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import {
  candidateIdSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
import { toCandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import { toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import { fetchCandidateReferentials } from '@/server/read-models/candidate-referentials.adapter'
import { uploadBlob, deleteBlob, vercelBlobClient } from '@/server/services/blob'
import { createCvExtractionProvider } from '@/server/ai/cv-extraction-provider'
import { runCvExtraction } from '@/server/ai/cv-extraction'
import {
  handleConfirmCvExtraction,
  handleExtractCv,
  type CandidateCvDeps,
} from '@/server/routers/candidate-cv'
import {
  confirmCvExtractionSchema,
  extractCvSchema,
} from '@/server/routers/candidate-cv.schema'

export type CandidateDeps = CandidateCvDeps & {
  listForKanban: () => Promise<RawCandidate[]>
  listStages: () => Promise<RawStage[]>
  updateProfile: (
    id: string,
    data: Parameters<typeof candidateRepository.updateProfile>[1],
  ) => ReturnType<typeof candidateRepository.updateProfile>
  referentials: () => ReturnType<typeof fetchCandidateReferentials>
}

async function listKanban(deps: CandidateDeps) {
  const [candidates, stages] = await Promise.all([deps.listForKanban(), deps.listStages()])
  return { candidates, stages }
}

export function makeCandidateRouter(deps: CandidateDeps) {
  return router({
    list: protectedProcedure.query(() => listKanban(deps)),
    cvtheque: protectedProcedure.query(() => listKanban(deps)),
    getById: protectedProcedure.input(candidateIdSchema).query(async ({ input }) => {
      const candidate = await deps.findProfileById(input.id)
      if (!candidate) return null
      return toCandidateProfilePayload(candidate)
    }),
    referentials: protectedProcedure.query(() => deps.referentials()),
    update: protectedProcedure.input(updateCandidateSchema).mutation(({ input }) =>
      deps.updateProfile(input.id, toCandidateUpdateData(input.data)),
    ),
    extractCv: protectedProcedure.input(extractCvSchema).mutation(({ input }) =>
      handleExtractCv(deps, input),
    ),
    confirmExtraction: protectedProcedure
      .input(confirmCvExtractionSchema)
      .mutation(({ input }) => handleConfirmCvExtraction(deps, input)),
  })
}

const cvProvider = createCvExtractionProvider()

export const candidateRouter = makeCandidateRouter({
  listForKanban: () => candidateRepository.listForKanban(),
  listStages: () => pipelineStageRepository.list(),
  findProfileById: (id) => candidateRepository.findProfileById(id),
  updateProfile: (id, data) => candidateRepository.updateProfile(id, data),
  referentials: fetchCandidateReferentials,
  uploadCvBlob: (input) => uploadBlob(vercelBlobClient, input),
  deleteCvBlob: (url) => deleteBlob(vercelBlobClient, url),
  runCvExtraction: (file) => runCvExtraction(cvProvider, file),
  listJobTitles: () => jobTitleRepository.list(),
  confirmCvExtraction: (id, data) => candidateRepository.updateProfile(id, data),
})
