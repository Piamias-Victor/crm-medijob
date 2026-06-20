const EARTH_RADIUS_KM = 6371

export type Coords = { lat: number; lon: number }

export type GeoLookup = (postalCode: string) => Promise<Coords | null>

export function haversineKm(a: Coords, b: Coords): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h))
}

const cache = new Map<string, Coords | null>()

export function createGeoLookup(fetchFn: typeof fetch = fetch): GeoLookup {
  return async (postalCode: string) => {
    const key = postalCode.trim()
    if (cache.has(key)) return cache.get(key) ?? null
    const res = await fetchFn(
      `https://geo.api.gouv.fr/search/?q=${encodeURIComponent(key)}&type=municipality&limit=1`,
    )
    if (!res.ok) {
      cache.set(key, null)
      return null
    }
    const data = (await res.json()) as { features?: { geometry: { coordinates: [number, number] } }[] }
    const coords = data.features?.[0]?.geometry.coordinates
    const parsed = coords ? { lon: coords[0], lat: coords[1] } : null
    cache.set(key, parsed)
    return parsed
  }
}

export function clearGeoLookupCache() {
  cache.clear()
}

export function createFixedGeoLookup(coords: Coords): GeoLookup {
  return async () => coords
}
