import { protectedProcedure } from '@/server/trpc'
import {
  candidateCreateInputSchema,
  updateCandidateSchema,
} from '@/view-models/candidate-profile.schema'
import { toCandidateCreateData, toCandidateUpdateData } from '@/view-models/candidate-profile-map'
import type { CandidateDeps } from '@/server/routers/candidate.deps'

export function candidateCreateMutation(deps: CandidateDeps) {
  return protectedProcedure.input(candidateCreateInputSchema).mutation(async ({ ctx, input }) => {
    const row = await deps.createProfile(toCandidateCreateData(input))
    await deps.logLifecycle({
      action: 'created',
      entityType: 'CANDIDATE',
      entityId: row.id,
      user: ctx.session.user,
    })
    return row
  })
}

export function candidateUpdateMutation(deps: CandidateDeps) {
  return protectedProcedure.input(updateCandidateSchema).mutation(async ({ ctx, input }) => {
    const row = await deps.updateProfile(input.id, toCandidateUpdateData(input.data))
    await deps.logLifecycle({
      action: 'updated',
      entityType: 'CANDIDATE',
      entityId: input.id,
      user: ctx.session.user,
    })
    return row
  })
}
