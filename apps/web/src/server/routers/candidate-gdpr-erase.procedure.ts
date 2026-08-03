import { z } from 'zod'
import { permissionProcedure } from '@/server/trpc'
import { eraseCandidateGdpr, type EraseCandidateGdprDeps } from '@/server/gdpr/erase-candidate'

export const gdprEraseCandidateSchema = z.object({
  id: z.string().min(1),
  reason: z.string().trim().max(500).optional(),
})

export function createGdprEraseCandidateProcedure(deps: EraseCandidateGdprDeps) {
  return permissionProcedure('gdpr.erase')
    .input(gdprEraseCandidateSchema)
    .mutation(async ({ ctx, input }) =>
      eraseCandidateGdpr(deps, {
        candidateId: input.id,
        erasedByUserId: ctx.session.user.id,
        reason: input.reason,
      }),
    )
}
