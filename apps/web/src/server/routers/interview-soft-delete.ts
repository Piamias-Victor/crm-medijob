import { permissionProcedure } from '@/server/trpc'
import { interviewAbandonSchema } from '@/view-models/interview-start.schema'
import type { AbandonInterviewDeps } from '@/server/interview/abandon'
import { abandonInterview } from '@/server/interview/abandon'

export function interviewSoftDeleteMutation(deps: AbandonInterviewDeps) {
  return permissionProcedure('softDelete')
    .input(interviewAbandonSchema)
    .mutation(async ({ input }) => {
      const result = await deps.softDeleteInterview(input.id)
      if (!result) throw new Error('INTERVIEW_NOT_FOUND')
      return { candidateId: result.candidateId }
    })
}
