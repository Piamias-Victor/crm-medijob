import { isFrenchPostalCode } from '@/lib/geo/gouv-coords'

export function radiusPostalCodePrefix(centerPostalCode: string | null, radiusKm: number) {
  if (!centerPostalCode || !isFrenchPostalCode(centerPostalCode)) return null
  if (radiusKm <= 50) return centerPostalCode.slice(0, 2)
  return null
}
