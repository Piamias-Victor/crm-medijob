import { TRPCError } from '@trpc/server'
import { filterPharmaciesByRadius } from '@/lib/geo/filter-pharmacies-in-radius'
import { resolveCandidateCenterCoords } from '@/lib/geo/resolve-candidate-center'
import { radiusPostalCodePrefix } from '@/lib/geo/radius-postal-code-prefix'
import type { GeoLookup } from '@/server/matching/distance'
import {
  buildRadiusListCacheKey,
  getCachedRadiusList,
  setCachedRadiusList,
} from '@/server/routers/candidate-list-in-radius-cache'
import type { ListPharmaciesInRadiusInput } from '@/server/routers/candidate-list-in-radius.schema'
import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'

export type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'

export type CandidateGeoProfile = {
  postalCode: string | null
  address: string | null
  city: string | null
}

export type PharmacyRadiusSource = {
  id: string
  name: string
  city: string | null
  postalCode: string | null
  email: string | null
  contacts: Array<{ id: string; email: string | null }>
}

export type ListPharmaciesInRadiusDeps = {
  findCandidateGeo: (id: string) => Promise<CandidateGeoProfile | null>
  listPharmaciesForRadius: (postalCodePrefix?: string | null) => Promise<PharmacyRadiusSource[]>
  lookupPostal: GeoLookup
  lookupQuery: GeoLookup
}

export async function handleListPharmaciesInRadius(
  deps: ListPharmaciesInRadiusDeps,
  input: ListPharmaciesInRadiusInput,
) {
  const cacheKey = buildRadiusListCacheKey(input.candidateId, input.radiusKm)
  const cached = getCachedRadiusList(cacheKey)
  if (cached) return cached

  const candidate = await deps.findCandidateGeo(input.candidateId)
  if (!candidate) throw new TRPCError({ code: 'NOT_FOUND', message: 'Candidat introuvable.' })

  const center = await resolveCandidateCenterCoords(candidate, deps.lookupPostal, deps.lookupQuery)
  if (!center) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Localisation candidat insuffisante pour calculer le périmètre.',
    })
  }

  const prefix = radiusPostalCodePrefix(candidate.postalCode, input.radiusKm)
  const pharmacies = await deps.listPharmaciesForRadius(prefix)
  const rows = await filterPharmaciesByRadius(pharmacies, center, input.radiusKm, deps.lookupPostal)
  const result = { pharmacies: rows, centerLabel: formatCenterLabel(candidate) }
  setCachedRadiusList(cacheKey, result)
  return result
}

function formatCenterLabel(candidate: CandidateGeoProfile) {
  const city = candidate.city?.trim()
  const postalCode = candidate.postalCode?.trim()
  if (city && postalCode) return `${city} (${postalCode})`
  return city ?? postalCode ?? 'Profil candidat'
}
