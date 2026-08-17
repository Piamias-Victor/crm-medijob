import { router, protectedProcedure } from '@/server/trpc'
import { interviewRepository } from '@/server/db/repositories/interview.repository'
import { toInterviewListRow, type InterviewRecord } from '@/view-models/interview-list'
import { getInterviewSchema, listInterviewsSchema } from '@/server/routers/interview.schema'

export type InterviewDeps = {
  listByCandidate: (candidateId: string) => Promise<InterviewRecord[]>
  findById: (id: string) => Promise<InterviewRecord | null>
}

export function makeInterviewRouter(deps: InterviewDeps) {
  return router({
    listByCandidate: protectedProcedure.input(listInterviewsSchema).query(async ({ input }) =>
      (await deps.listByCandidate(input.candidateId)).map(toInterviewListRow),
    ),
    getById: protectedProcedure.input(getInterviewSchema).query(async ({ input }) => {
      const row = await deps.findById(input.id)
      return row ? toInterviewListRow(row) : null
    }),
  })
}

export const interviewRouter = makeInterviewRouter({
  listByCandidate: (candidateId) => interviewRepository.listByCandidate(candidateId),
  findById: (id) => interviewRepository.findById(id),
})
