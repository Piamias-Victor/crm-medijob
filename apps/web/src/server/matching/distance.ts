import type { Coords } from '@/lib/geo/coords'
import {
  createAddressLookup,
  createCommuneCityLookup,
  createCommunePostalLookup,
} from '@/lib/geo/gouv-coords'

export type { Coords } from '@/lib/geo/coords'

export type GeoLookup = (query: string) => Promise<Coords | null>

const EARTH_RADIUS_KM = 6371

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

export function createGeoLookup(fetchFn: typeof fetch = fetch): GeoLookup {
  return createCommunePostalLookup(fetchFn)
}

export function createGeoQueryLookup(fetchFn: typeof fetch = fetch): GeoLookup {
  const byCity = createCommuneCityLookup(fetchFn)
  const byAddress = createAddressLookup(fetchFn)
  return async (query: string) => (await byAddress(query)) ?? (await byCity(query))
}

export function createFixedGeoLookup(coords: Coords): GeoLookup {
  return async () => coords
}
