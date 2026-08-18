import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { interviewRepository } from '@/server/db/repositories/interview.repository'
import { interviewTemplateRepository } from '@/server/db/repositories/interview-template.repository'
import { toInterviewListRow, type InterviewRecord } from '@/view-models/interview-list'
import { getInterviewSchema, listInterviewsSchema } from '@/server/routers/interview.schema'
import {
  interviewAbandonMutation,
  interviewSaveDraftMutation,
  interviewStartMutation,
  type InterviewWriteDeps,
} from '@/server/routers/interview-mutations'
import { loadInterviewRun, type LoadInterviewRunDeps } from '@/server/interview/load-run'
import { toInterviewCandidateCreate } from '@/view-models/interview-candidate-create'
import { interviewCloseLiveDeps } from '@/server/interview/close-live'
import {
  interviewCloseMutation,
  interviewPreviewCloseQuery,
  type InterviewCloseDeps,
} from '@/server/routers/interview-close'
import { interviewSoftDeleteMutation } from '@/server/routers/interview-soft-delete'
import { interviewGeneratePdfMutation } from '@/server/routers/interview-generate-pdf'
import {
  storeInterviewCompteRendu,
  type StoreInterviewPdfDeps,
} from '@/server/interview/store-interview-pdf'
import { interviewPdfLiveDeps } from '@/server/interview/interview-pdf-live'

export type InterviewDeps = {
  listByCandidate: (candidateId: string) => Promise<InterviewRecord[]>
  findById: (id: string) => Promise<InterviewRecord | null>
} & InterviewWriteDeps &
  LoadInterviewRunDeps &
  InterviewCloseDeps &
  StoreInterviewPdfDeps

export function makeInterviewRouter(deps: InterviewDeps) {
  return router({
    listByCandidate: protectedProcedure.input(listInterviewsSchema).query(async ({ input }) =>
      (await deps.listByCandidate(input.candidateId)).map(toInterviewListRow),
    ),
    getById: protectedProcedure.input(getInterviewSchema).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      return row ? toInterviewListRow(row) : null
    }),
    start: interviewStartMutation(deps),
    abandon: interviewAbandonMutation(deps),
    saveDraft: interviewSaveDraftMutation(deps),
    close: interviewCloseMutation(deps),
    previewClose: interviewPreviewCloseQuery(deps),
    generatePdf: interviewGeneratePdfMutation(deps),
    softDelete: interviewSoftDeleteMutation(deps),
    getRun: protectedProcedure.input(getInterviewSchema).query(async ({ input }) =>
      loadInterviewRun(input.id, deps),
    ),
  })
}

const interviewPdfStore = interviewPdfLiveDeps()

export const interviewRouter = makeInterviewRouter({
  listByCandidate: (candidateId) => interviewRepository.listByCandidate(candidateId),
  findById: (id) => interviewRepository.findById(id),
  findCandidateById: async (id) => {
    const row = await candidateRepository.findById(id)
    return row ? { id: row.id, jobTitleId: row.jobTitleId } : null
  },
  findDraftByCandidate: (candidateId) => interviewRepository.findDraftByCandidate(candidateId),
  setJobTitleIfMissing: async (id, jobTitleId) => {
    await candidateRepository.setJobTitle(id, jobTitleId)
  },
  createCandidate: (data) => candidateRepository.createProfile(toInterviewCandidateCreate(data)),
  createInterview: (data) => interviewRepository.create(data),
  softDeleteInterview: (id) => interviewRepository.softDelete(id),
  updateAnswers: (id, answers) => interviewRepository.updateAnswers(id, answers),
  findCandidateProfileKey: (candidateId) => candidateRepository.findJobTitleProfileKey(candidateId),
  findTemplate: (profileKey, mode) => interviewTemplateRepository.findByProfileMode(profileKey, mode),
  ...interviewCloseLiveDeps(),
  ...interviewPdfStore,
  storePdf: (id) => storeInterviewCompteRendu(id, interviewPdfStore),
})
