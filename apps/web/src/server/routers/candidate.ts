import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import {
  candidateIdSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
import {
  candidateQuickCreateSchema,
  type CandidateQuickCreateInput,
} from '@/view-models/candidate-quick-create.schema'
import { toCandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import { toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import { loadCandidateReferentials } from '@/server/read-models/candidate-referentials'
import {
  handleConfirmCvExtraction,
  handleExtractCv,
  type CandidateCvDeps,
} from '@/server/routers/candidate-cv'
import {
  handleGenerateAnonymized,
  handleGenerateSummary,
  handleSaveCvSummary,
  type CandidateDocumentsDeps,
} from '@/server/routers/candidate-documents'
import {
  confirmCvExtractionSchema,
  extractCvSchema,
} from '@/server/routers/candidate-cv.schema'
import { saveCvSummarySchema } from '@/server/routers/candidate-documents.schema'
import type { CandidateSearchRow } from '@/server/routers/candidate-search'
import {
  candidateSearchInput,
  toCandidateSearchOptions,
} from '@/server/routers/candidate-search'

export type CandidateDeps = CandidateCvDeps &
  CandidateDocumentsDeps & {
  listForKanban: () => Promise<RawCandidate[]>
  listStages: () => Promise<RawStage[]>
  search: (term: string, limit?: number) => Promise<CandidateSearchRow[]>
  updateProfile: (
    id: string,
    data: Parameters<typeof candidateRepository.updateProfile>[1],
  ) => ReturnType<typeof candidateRepository.updateProfile>
  createQuick: (input: CandidateQuickCreateInput) => ReturnType<typeof candidateRepository.createQuick>
  referentials: () => ReturnType<typeof loadCandidateReferentials>
}

async function listKanban(deps: CandidateDeps) {
  const [rows, stages] = await Promise.all([deps.listForKanban(), deps.listStages()])
  return { rows, stages }
}

export function makeCandidateRouter(deps: CandidateDeps) {
  return router({
    list: protectedProcedure.query(() => listKanban(deps)),
    search: protectedProcedure.input(candidateSearchInput).query(async ({ input }) =>
      toCandidateSearchOptions(await deps.search(input.term, input.limit)),
    ),
    getById: protectedProcedure.input(candidateIdSchema).query(async ({ input }) => {
      const candidate = await deps.findProfileById(input.id)
      if (!candidate) return null
      return toCandidateProfilePayload(candidate)
    }),
    referentials: protectedProcedure.query(() => deps.referentials()),
    create: protectedProcedure
      .input(candidateQuickCreateSchema)
      .mutation(({ input }) => deps.createQuick(input)),
    update: protectedProcedure.input(updateCandidateSchema).mutation(({ input }) =>
      deps.updateProfile(input.id, toCandidateUpdateData(input.data)),
    ),
    extractCv: protectedProcedure.input(extractCvSchema).mutation(({ input }) =>
      handleExtractCv(deps, input),
    ),
    confirmExtraction: protectedProcedure
      .input(confirmCvExtractionSchema)
      .mutation(({ input }) => handleConfirmCvExtraction(deps, input)),
    generateSummary: protectedProcedure.input(candidateIdSchema).mutation(({ input }) =>
      handleGenerateSummary(deps, input.id),
    ),
    saveCvSummary: protectedProcedure.input(saveCvSummarySchema).mutation(({ input }) =>
      handleSaveCvSummary(deps, input.id, input.cvSummary),
    ),
    generateAnonymized: protectedProcedure.input(candidateIdSchema).mutation(({ input }) =>
      handleGenerateAnonymized(deps, input.id),
    ),
  })
}
