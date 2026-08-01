import { collectPharmacyDuplicateMatches } from '@/server/pharmacy/detect-duplicate'
import { normalizeSiret } from '@/server/pharmacy/normalize-pharmacy-identity'
import type { PharmacyDuplicateIdentity } from '@/server/pharmacy/detect-duplicate.types'
import type { DetectPharmacyDuplicateInput } from '@/view-models/pharmacy-duplicate.schema'

export type PharmacyDuplicateLookups = {
  findIdentityBySiret: (siret: string) => Promise<PharmacyDuplicateIdentity | null>
  findIdentityByNameCityPostal: (
    name: string,
    city: string,
    postalCode: string,
  ) => Promise<PharmacyDuplicateIdentity | null>
}

export async function detectPharmacyDuplicates(
  input: DetectPharmacyDuplicateInput,
  lookups: PharmacyDuplicateLookups,
) {
  const siret = input.siret ? normalizeSiret(input.siret) : undefined
  const siretHit =
    siret && siret.length > 0 ? await lookups.findIdentityBySiret(siret) : null

  const canIdentity = Boolean(input.name && input.city && input.postalCode)
  const nameHit =
    canIdentity && input.name && input.city && input.postalCode
      ? await lookups.findIdentityByNameCityPostal(input.name, input.city, input.postalCode)
      : null

  return collectPharmacyDuplicateMatches(siretHit, nameHit, input.excludeId)
}
