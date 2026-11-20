import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { GeoLookup } from '@/server/matching/distance'
import { filterByNearRadius } from '@/server/matching/within-radius'

type GeoRow = { city?: string | null; postalCode?: string | null }

export async function applyNearFilter<T extends GeoRow>(
  rows: T[],
  filters: CandidateListFilters | undefined,
  lookupGeo: GeoLookup,
): Promise<T[]> {
  if (!filters?.near) return rows
  const radiusKm = filters.radiusKm ?? DEFAULT_MOBILITY_RADIUS_KM
  return filterByNearRadius(rows, filters.near, radiusKm, lookupGeo)
}
