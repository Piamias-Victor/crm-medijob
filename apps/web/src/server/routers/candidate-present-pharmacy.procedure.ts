import { protectedProcedure } from '@/server/trpc'
import { handlePresentToPharmacy } from '@/server/routers/candidate-present-pharmacy'
import { presentToPharmacyInputSchema } from '@/server/routers/candidate-present-pharmacy.schema'
import type { CandidateDeps } from '@/server/routers/candidate.deps'

export function createPresentToPharmacyProcedure(deps: CandidateDeps) {
  return protectedProcedure
    .input(presentToPharmacyInputSchema)
    .mutation(({ input }) => handlePresentToPharmacy(deps, input))
}
