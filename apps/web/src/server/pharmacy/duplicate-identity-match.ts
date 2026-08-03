import {
  normalizeCity,
  normalizePostalCode,
  normalizePharmacyName,
  normalizeSiret,
} from '@/server/pharmacy/normalize-pharmacy-identity'
import type { PharmacyDuplicateIdentity } from '@/server/pharmacy/detect-duplicate.types'

export function siretMatches(left: string | null | undefined, right: string): boolean {
  if (!left) return false
  return normalizeSiret(left) === normalizeSiret(right)
}

export function nameCityPostalMatches(
  identity: Pick<PharmacyDuplicateIdentity, 'name' | 'city' | 'postalCode'>,
  name: string,
  city: string,
  postalCode: string,
): boolean {
  if (!identity.city || !identity.postalCode) return false
  return (
    normalizePharmacyName(identity.name) === normalizePharmacyName(name) &&
    normalizeCity(identity.city) === normalizeCity(city) &&
    normalizePostalCode(identity.postalCode) === normalizePostalCode(postalCode)
  )
}

export function pickNameCityPostalMatch(
  rows: PharmacyDuplicateIdentity[],
  name: string,
  city: string,
  postalCode: string,
): PharmacyDuplicateIdentity | null {
  return rows.find((row) => nameCityPostalMatches(row, name, city, postalCode)) ?? null
}
