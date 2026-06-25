import { fetchCommunes } from '@/lib/geo/communes-api'
import type { Coords } from '@/lib/geo/coords'

type CommuneRow = { centre?: { coordinates?: [number, number] } }

type AddressFeature = { geometry?: { coordinates?: [number, number] } }

const ADDRESS_BASE = 'https://api-adresse.data.gouv.fr/search'

export function isFrenchPostalCode(value: string) {
  return /^\d{5}$/.test(value.trim())
}

async function fetchCommuneCoords(
  fetchFn: typeof fetch,
  params: Record<string, string>,
  cacheKey: string,
  cache: Map<string, Coords | null>,
): Promise<Coords | null> {
  if (cache.has(cacheKey)) return cache.get(cacheKey) ?? null
  const rows = (await fetchCommunes({ ...params, fields: 'centre', limit: '1' }, fetchFn)) as CommuneRow[]
  const coords = rows[0]?.centre?.coordinates
  const parsed = coords ? { lon: coords[0], lat: coords[1] } : null
  cache.set(cacheKey, parsed)
  return parsed
}

export function createCommunePostalLookup(fetchFn: typeof fetch = fetch) {
  const cache = new Map<string, Coords | null>()
  return async (postalCode: string) => {
    const code = postalCode.trim()
    if (!isFrenchPostalCode(code)) return null
    return fetchCommuneCoords(fetchFn, { codePostal: code }, `cp:${code}`, cache)
  }
}

export function createCommuneCityLookup(fetchFn: typeof fetch = fetch) {
  const cache = new Map<string, Coords | null>()
  return async (city: string) =>
    fetchCommuneCoords(fetchFn, { nom: city.trim() }, `city:${city.trim()}`, cache)
}

export function createAddressLookup(fetchFn: typeof fetch = fetch) {
  const cache = new Map<string, Coords | null>()
  return async (query: string) => {
    const key = `addr:${query.trim()}`
    if (cache.has(key)) return cache.get(key) ?? null
    const res = await fetchFn(`${ADDRESS_BASE}/?q=${encodeURIComponent(query.trim())}&limit=1`)
    if (!res.ok) {
      cache.set(key, null)
      return null
    }
    const data = (await res.json()) as { features?: AddressFeature[] }
    const coords = data.features?.[0]?.geometry?.coordinates
    const parsed = coords ? { lon: coords[0], lat: coords[1] } : null
    cache.set(key, parsed)
    return parsed
  }
}
