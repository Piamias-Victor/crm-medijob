import { isFrenchPostalCode } from '@/lib/geo/gouv-coords'
import {
  createGeoLookup,
  createGeoQueryLookup,
  type GeoLookup,
} from '@/server/matching/distance'

export function createAvailabilityFilterGeoLookup(
  fetchFn: typeof fetch = fetch,
): GeoLookup {
  const postal = createGeoLookup(fetchFn)
  const query = createGeoQueryLookup(fetchFn)
  return async (value) =>
    isFrenchPostalCode(value) ? postal(value) : query(value)
}
