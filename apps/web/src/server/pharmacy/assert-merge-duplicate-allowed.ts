import { TRPCError } from '@trpc/server'
import type {
  DetectPharmacyDuplicateInput,
  PharmacyMergeInput,
} from '@/view-models/pharmacy-duplicate.schema'
import type { PharmacyDuplicateMatch } from '@/server/pharmacy/detect-duplicate.types'

type DetectDuplicates = (input: DetectPharmacyDuplicateInput) => Promise<PharmacyDuplicateMatch[]>

export async function assertPharmacyMergeDuplicateAllowed(
  input: PharmacyMergeInput,
  detectDuplicates: DetectDuplicates,
) {
  const matches = await detectDuplicates({
    name: input.data.name,
    siret: input.data.siret,
    city: input.data.city,
    postalCode: input.data.postalCode,
    excludeId: input.absorbedId,
  })
  if (!matches.some((match) => match.pharmacyId === input.keptId)) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Fusion non autorisée pour ces pharmacies.',
    })
  }
}
