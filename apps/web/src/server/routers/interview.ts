import { router, protectedProcedure } from '@/server/trpc'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { interviewRepository } from '@/server/db/repositories/interview.repository'
import { toInterviewListRow, type InterviewRecord } from '@/view-models/interview-list'
import { getInterviewSchema, listInterviewsSchema } from '@/server/routers/interview.schema'
import {
  interviewAbandonMutation,
  interviewStartMutation,
  type InterviewWriteDeps,
} from '@/server/routers/interview-mutations'
import { toInterviewCandidateCreate } from '@/view-models/interview-candidate-create'

export type InterviewDeps = {
  listByCandidate: (candidateId: string) => Promise<InterviewRecord[]>
  findById: (id: string) => Promise<InterviewRecord | null>
} & InterviewWriteDeps

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
  })
}

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
})
