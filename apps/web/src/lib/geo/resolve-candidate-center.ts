import { isFrenchPostalCode } from '@/lib/geo/gouv-coords'
import type { GeoLookup } from '@/server/matching/distance'

type CandidateGeo = {
  postalCode: string | null
  address: string | null
  city: string | null
}

export async function resolveCandidateCenterCoords(
  candidate: CandidateGeo,
  lookupPostal: GeoLookup,
  lookupQuery: GeoLookup,
) {
  const postalCode = candidate.postalCode?.trim()
  const address = candidate.address?.trim()
  const city = candidate.city?.trim()

  if (postalCode && isFrenchPostalCode(postalCode)) {
    const byPostal = await lookupPostal(postalCode)
    if (byPostal) return byPostal
  }

  if (address) {
    const byAddress = await lookupQuery([address, postalCode, city].filter(Boolean).join(' '))
    if (byAddress) return byAddress
  }

  if (city) return lookupQuery(city)

  return null
}
