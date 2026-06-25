import { createTtlCache } from '@/lib/cache/ttl-cache'
import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'

type ListResult = { pharmacies: PharmacyInRadiusRow[]; centerLabel: string }

const LIST_CACHE_TTL_MS = 60_000
const listCache = createTtlCache<ListResult>(LIST_CACHE_TTL_MS)

export function getCachedRadiusList(key: string) {
  return listCache.get(key)
}

export function setCachedRadiusList(key: string, value: ListResult) {
  listCache.set(key, value)
}

export function clearRadiusListCache() {
  listCache.clear()
}

export function buildRadiusListCacheKey(candidateId: string, radiusKm: number) {
  return `${candidateId}:${radiusKm}`
}
