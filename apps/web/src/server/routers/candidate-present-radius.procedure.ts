import { protectedProcedure } from '@/server/trpc'
import { handlePresentInRadius } from '@/server/routers/candidate-present-radius'
import { presentInRadiusInputSchema } from '@/server/routers/candidate-present-radius.schema'
import type { CandidateDeps } from '@/server/routers/candidate.deps'

export function createPresentInRadiusProcedure(deps: CandidateDeps) {
  return protectedProcedure
    .input(presentInRadiusInputSchema)
    .mutation(({ input }) => handlePresentInRadius(deps, input))
}
