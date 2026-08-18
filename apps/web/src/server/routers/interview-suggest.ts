import { TRPCError } from '@trpc/server'
import { mapAssistantChatError } from '@/server/ai/router-errors'
import { protectedProcedure } from '@/server/trpc'
import { getInterviewSchema } from '@/server/routers/interview.schema'
import {
  suggestInterviewCvSummary,
  type SuggestCvSummaryDeps,
} from '@/server/interview/suggest-cv-summary'
import { INTERVIEW_CLOSE_NOT_DRAFT } from '@/view-models/interview-copy'

function mapSuggestError(error: unknown): never {
  if (error instanceof Error && error.message === 'INTERVIEW_NOT_FOUND') {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Entretien introuvable.' })
  }
  if (error instanceof Error && error.message === 'INTERVIEW_NOT_DRAFT') {
    throw new TRPCError({ code: 'BAD_REQUEST', message: INTERVIEW_CLOSE_NOT_DRAFT })
  }
  throw mapAssistantChatError(error)
}

export function interviewSuggestCvSummaryMutation(deps: SuggestCvSummaryDeps) {
  return protectedProcedure.input(getInterviewSchema).mutation(async ({ input }) => {
    try {
      return await suggestInterviewCvSummary(input.id, deps)
    } catch (error) {
      mapSuggestError(error)
    }
  })
}
