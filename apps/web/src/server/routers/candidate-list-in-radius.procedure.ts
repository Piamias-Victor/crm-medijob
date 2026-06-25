import { protectedProcedure } from '@/server/trpc'
import { handleListPharmaciesInRadius } from '@/server/routers/candidate-list-in-radius'
import { listPharmaciesInRadiusInputSchema } from '@/server/routers/candidate-list-in-radius.schema'
import type { CandidateDeps } from '@/server/routers/candidate.deps'

export function createListPharmaciesInRadiusProcedure(deps: CandidateDeps) {
  return protectedProcedure
    .input(listPharmaciesInRadiusInputSchema)
    .query(({ input }) => handleListPharmaciesInRadius(deps, input))
}
