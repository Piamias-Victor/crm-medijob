import { TRPCError } from '@trpc/server'
import { protectedProcedure } from '@/server/trpc'
import { candidateIdSchema } from '@/view-models/candidate-profile.schema'
import type { CandidateDeps } from '@/server/routers/candidate.deps'
import { readCommentsOrEmpty } from '@/server/badakan/read-comments'

export function createListCandidateCommentsProcedure(
  deps: Pick<CandidateDeps, 'findProfileById' | 'getComments'>,
) {
  return protectedProcedure.input(candidateIdSchema).query(async ({ input }) => {
    const candidate = await deps.findProfileById(input.id)
    if (!candidate) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable' })
    const targetId = candidate.badakanId
    if (!targetId) return []
    return readCommentsOrEmpty(() => deps.getComments(targetId))
  })
}
