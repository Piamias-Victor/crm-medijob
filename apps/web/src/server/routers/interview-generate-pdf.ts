import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '@/server/trpc'
import { getInterviewSchema } from '@/server/routers/interview.schema'
import {
  storeInterviewCompteRendu,
  type StoreInterviewPdfDeps,
} from '@/server/interview/store-interview-pdf'
import { INTERVIEW_PDF_NOT_CLOSED, INTERVIEW_PDF_NOT_FOUND } from '@/view-models/interview-pdf-copy'

export function interviewGeneratePdfMutation(deps: StoreInterviewPdfDeps) {
  return protectedProcedure.input(getInterviewSchema).mutation(async ({ input }) => {
    try {
      return await storeInterviewCompteRendu(input.id, deps)
    } catch (error) {
      if (error instanceof Error && error.message === 'INTERVIEW_NOT_FOUND') {
        throw new TRPCError({ code: 'NOT_FOUND', message: INTERVIEW_PDF_NOT_FOUND })
      }
      if (error instanceof Error && error.message === 'INTERVIEW_NOT_CLOSED') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: INTERVIEW_PDF_NOT_CLOSED })
      }
      throw error
    }
  })
}
