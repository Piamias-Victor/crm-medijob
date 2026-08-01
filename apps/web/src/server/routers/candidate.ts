import { router, protectedProcedure, permissionProcedure } from '@/server/trpc'
import {
  candidateIdSchema,
  candidateCreateInputSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
import { toCandidateProfilePayload } from '@/view-models/candidate-profile-payload'
import { toCandidateCreateData, toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import { handleConfirmCvExtraction, handleExtractCv, handleExtractCvDraft } from '@/server/routers/candidate-cv'
import { handleDiscardCvDraft } from '@/server/routers/candidate-cv-discard'
import { handleGenerateAnonymized, handleGenerateSummary, handleSaveCvSummary } from '@/server/routers/candidate-documents'
import { confirmCvExtractionSchema, discardCvDraftSchema, extractCvDraftSchema, extractCvSchema } from '@/server/routers/candidate-cv.schema'
import { saveCvSummarySchema } from '@/server/routers/candidate-documents.schema'
import { candidateSearchInput, toCandidateSearchOptions } from '@/server/routers/candidate-search'
import { candidateListFiltersSchema } from '@/view-models/candidate-list-filters.schema'
import { candidateExportInputSchema } from '@/view-models/candidate-export.schema'
import { handleCandidateExportCsv } from '@/server/routers/candidate-export'
import type { CandidateDeps } from '@/server/routers/candidate.deps'
import { detectDuplicateInputSchema, candidateMergeInputSchema } from '@/view-models/candidate-duplicate.schema'
import { handleDetectDuplicate, handleMergeCandidate } from '@/server/routers/candidate-duplicate-handlers'
import { createPresentToPharmacyProcedure } from '@/server/routers/candidate-present-pharmacy.procedure'
import { createListPharmaciesInRadiusProcedure } from '@/server/routers/candidate-list-in-radius.procedure'
import { createPresentInRadiusProcedure } from '@/server/routers/candidate-present-radius.procedure'

export type { CandidateDeps } from '@/server/routers/candidate.deps'

export function makeCandidateRouter(deps: CandidateDeps) {
  return router({
    list: protectedProcedure.input(candidateListFiltersSchema.optional()).query(async ({ input }) => {
      const [rows, stages] = await Promise.all([deps.listForKanban(input), deps.listStages()])
      return { rows, stages }
    }),
    exportCsv: permissionProcedure('export')
      .input(candidateExportInputSchema)
      .query(({ input }) => handleCandidateExportCsv(deps, input)),

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
      .mutation(async ({ ctx, input }) => {
        const row = await deps.createProfile(toCandidateCreateData(input))
        await deps.logLifecycle({
          action: 'created',
          entityType: 'CANDIDATE',
          entityId: row.id,
          user: ctx.session.user,
        })
        return row
      }),
    update: protectedProcedure.input(updateCandidateSchema).mutation(async ({ ctx, input }) => {
      const row = await deps.updateProfile(input.id, toCandidateUpdateData(input.data))
      await deps.logLifecycle({
        action: 'updated',
        entityType: 'CANDIDATE',
        entityId: input.id,
        user: ctx.session.user,
      })
      return row
    }),
    extractCvDraft: protectedProcedure.input(extractCvDraftSchema).mutation(({ input }) =>
      handleExtractCvDraft(deps, input),
    ),
    discardCvDraft: protectedProcedure.input(discardCvDraftSchema).mutation(({ input }) =>
      handleDiscardCvDraft(deps, input),
    ),
    extractCv: protectedProcedure.input(extractCvSchema).mutation(({ input }) => handleExtractCv(deps, input)),
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
    detectDuplicate: protectedProcedure.input(detectDuplicateInputSchema).query(({ input }) =>
      handleDetectDuplicate(deps, input),
    ),
    merge: protectedProcedure.input(candidateMergeInputSchema).mutation(({ input }) =>
      handleMergeCandidate(deps, input),
    ),
    presentToPharmacy: createPresentToPharmacyProcedure(deps),
    listPharmaciesInRadius: createListPharmaciesInRadiusProcedure(deps),
    presentInRadius: createPresentInRadiusProcedure(deps),
  })
}
