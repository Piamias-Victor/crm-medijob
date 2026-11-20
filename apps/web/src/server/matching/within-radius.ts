import { haversineKm, type GeoLookup } from '@/server/matching/distance'

export type GeoSubject = {
  city?: string | null
  postalCode?: string | null
}

export async function isWithinRadius(
  subject: GeoSubject,
  originQuery: string,
  radiusKm: number,
  lookupGeo: GeoLookup,
): Promise<boolean> {
  const origin = await lookupGeo(originQuery)
  const destQuery = subject.postalCode?.trim() || subject.city?.trim()
  if (!origin || !destQuery) return false
  const dest = await lookupGeo(destQuery)
  if (!dest) return false
  return haversineKm(origin, dest) <= radiusKm
}

export async function filterByNearRadius<T extends GeoSubject>(
  rows: T[],
  originQuery: string,
  radiusKm: number,
  lookupGeo: GeoLookup,
): Promise<T[]> {
  const kept: T[] = []
  for (const row of rows) {
    if (await isWithinRadius(row, originQuery, radiusKm, lookupGeo)) kept.push(row)
  }
  return kept
}
