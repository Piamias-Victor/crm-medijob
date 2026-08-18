import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '@/server/trpc'
import { abandonInterview, type AbandonInterviewDeps } from '@/server/interview/abandon'
import {
  InterviewDraftOpenError,
  startInterview,
  type StartInterviewDeps,
} from '@/server/interview/start'
import {
  interviewAbandonSchema,
  interviewStartSchema,
} from '@/view-models/interview-start.schema'
import { interviewSaveDraftSchema } from '@/view-models/interview-draft.schema'
import { INTERVIEW_DRAFT_OPEN, INTERVIEW_NOT_DRAFT } from '@/view-models/interview-copy'
import {
  saveInterviewDraft,
  type SaveInterviewDraftDeps,
} from '@/server/interview/save-draft'

export type InterviewWriteDeps = StartInterviewDeps &
  AbandonInterviewDeps &
  SaveInterviewDraftDeps

function mapStartError(error: unknown): never {
  if (error instanceof InterviewDraftOpenError) {
    throw new TRPCError({ code: 'CONFLICT', message: INTERVIEW_DRAFT_OPEN })
  }
  if (error instanceof Error && error.message === 'CANDIDATE_NOT_FOUND') {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })
  }
  throw error
}

export function interviewStartMutation(deps: StartInterviewDeps) {
  return protectedProcedure.input(interviewStartSchema).mutation(async ({ ctx, input }) => {
    try {
      return await startInterview(input, ctx.session.user.id, deps)
    } catch (error) {
      mapStartError(error)
    }
  })
}

export function interviewAbandonMutation(deps: AbandonInterviewDeps) {
  return protectedProcedure.input(interviewAbandonSchema).mutation(async ({ input }) => {
    try {
      return await abandonInterview(input.id, deps)
    } catch (error) {
      if (error instanceof Error && error.message === 'INTERVIEW_NOT_FOUND') {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Entretien introuvable.' })
      }
      if (error instanceof Error && error.message === 'INTERVIEW_NOT_DRAFT') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: INTERVIEW_NOT_DRAFT })
      }
      throw error
    }
  })
}

export function interviewSaveDraftMutation(deps: SaveInterviewDraftDeps) {
  return protectedProcedure.input(interviewSaveDraftSchema).mutation(async ({ input }) => {
    try {
      return await saveInterviewDraft(input.id, input.answers, deps)
    } catch (error) {
      if (error instanceof Error && error.message === 'INTERVIEW_NOT_FOUND') {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Entretien introuvable.' })
      }
      if (error instanceof Error && error.message === 'INTERVIEW_NOT_DRAFT') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: INTERVIEW_NOT_DRAFT })
      }
      throw error
    }
  })
}
