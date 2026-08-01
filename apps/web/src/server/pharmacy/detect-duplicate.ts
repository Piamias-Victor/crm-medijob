import type {
  PharmacyDuplicateIdentity,
  PharmacyDuplicateMatch,
} from '@/server/pharmacy/detect-duplicate.types'

function toMatch(
  identity: PharmacyDuplicateIdentity,
  reason: PharmacyDuplicateMatch['reason'],
): PharmacyDuplicateMatch {
  return {
    pharmacyId: identity.id,
    reason,
    name: identity.name,
    siret: identity.siret,
    city: identity.city,
    postalCode: identity.postalCode,
    deletedAt: identity.deletedAt,
  }
}

export function collectPharmacyDuplicateMatches(
  siretHit: PharmacyDuplicateIdentity | null,
  nameCityPostalHit: PharmacyDuplicateIdentity | null,
  excludeId?: string,
): PharmacyDuplicateMatch[] {
  const matches: PharmacyDuplicateMatch[] = []
  if (siretHit && siretHit.id !== excludeId) matches.push(toMatch(siretHit, 'siret'))
  if (
    nameCityPostalHit &&
    nameCityPostalHit.id !== excludeId &&
    !matches.some((m) => m.pharmacyId === nameCityPostalHit.id)
  ) {
    matches.push(toMatch(nameCityPostalHit, 'name_city_postal'))
  }
  return matches
}
