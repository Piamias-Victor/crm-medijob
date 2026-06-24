import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import {
  candidateIdSchema,
  candidateCreateInputSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
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
import { candidateListFiltersSchema, type CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import { candidateExportInputSchema } from '@/view-models/candidate-export.schema'
import type { RawCandidateExport } from '@/view-models/candidate-export.types'
import type { CvthequeExportColumnId } from '@/view-models/cvtheque-export-column-ids'
import { handleCandidateExportCsv } from '@/server/routers/candidate-export'

export type CandidateDeps = CandidateCvDeps &
  CandidateDocumentsDeps & {
  listForKanban: (filters?: CandidateListFilters) => Promise<RawCandidate[]>
  listForExport: (filters?: CandidateListFilters, columnIds?: CvthequeExportColumnId[]) => Promise<RawCandidateExport[]>
  listStages: () => Promise<RawStage[]>
  search: (term: string, limit?: number) => Promise<CandidateSearchRow[]>
  updateProfile: (
    id: string,
    data: Parameters<typeof candidateRepository.updateProfile>[1],
  ) => ReturnType<typeof candidateRepository.updateProfile>
  createProfile: (
    input: Parameters<typeof candidateRepository.createProfile>[0],
  ) => ReturnType<typeof candidateRepository.createProfile>
  referentials: () => ReturnType<typeof loadCandidateReferentials>
}

async function listKanban(deps: CandidateDeps, filters?: CandidateListFilters) {
  const [rows, stages] = await Promise.all([deps.listForKanban(filters), deps.listStages()])
  return { rows, stages }
}

export function makeCandidateRouter(deps: CandidateDeps) {
  return router({
    list: protectedProcedure.input(candidateListFiltersSchema.optional()).query(({ input }) =>
      listKanban(deps, input),
    ),
    exportCsv: protectedProcedure.input(candidateExportInputSchema).query(({ input }) =>
      handleCandidateExportCsv(deps, input),
    ),
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
      .input(candidateCreateInputSchema)
      .mutation(({ input }) => deps.createProfile(toCandidateUpdateData(input))),
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
