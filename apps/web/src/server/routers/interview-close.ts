import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '@/server/trpc'
import { closeInterview, type CloseInterviewDeps } from '@/server/interview/close'
import { previewInterviewClose, type PreviewCloseDeps } from '@/server/interview/preview-close'
import { interviewCloseSchema } from '@/view-models/interview-close.schema'
import { getInterviewSchema } from '@/server/routers/interview.schema'
import { INTERVIEW_CLOSE_NOT_DRAFT } from '@/view-models/interview-copy'

export type InterviewCloseDeps = CloseInterviewDeps & PreviewCloseDeps

function mapCloseError(error: unknown): never {
  if (error instanceof Error && error.message === 'INTERVIEW_NOT_FOUND') {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Entretien introuvable.' })
  }
  if (error instanceof Error && error.message === 'INTERVIEW_NOT_DRAFT') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: INTERVIEW_CLOSE_NOT_DRAFT })
  }
  throw error
}

export function interviewCloseMutation(deps: CloseInterviewDeps) {
  return protectedProcedure.input(interviewCloseSchema).mutation(async ({ ctx, input }) => {
    try {
      return await closeInterview(input, ctx.session.user.id, deps)
    } catch (error) {
      mapCloseError(error)
    }
  })
}

export function interviewPreviewCloseQuery(deps: PreviewCloseDeps) {
  return protectedProcedure.input(getInterviewSchema).query(({ input }) =>
    previewInterviewClose(input.id, deps),
  )
}
