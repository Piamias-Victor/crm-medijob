import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import { haversineKm, type GeoLookup } from '@/server/matching/distance'
import type { WeeklyAvailabilityFilterInput } from '@/view-models/weekly-availability-filter.schema'
import type {
  AvailabilityFilterPoolRow,
  WeeklyAvailabilityFilterStore,
} from './filter-pool'

type Params = {
  filterStore: WeeklyAvailabilityFilterStore
  lookupGeo: GeoLookup
  input: WeeklyAvailabilityFilterInput
}

export async function withinRadius(
  row: AvailabilityFilterPoolRow,
  city: string,
  radiusKm: number,
  lookupGeo: GeoLookup,
): Promise<boolean> {
  const origin = await lookupGeo(city)
  const destQuery = row.postalCode?.trim() || row.city?.trim()
  if (!origin || !destQuery) return false
  const dest = await lookupGeo(destQuery)
  if (!dest) return false
  return haversineKm(origin, dest) <= radiusKm
}

export async function filterAvailable({
  filterStore,
  lookupGeo,
  input,
}: Params): Promise<AvailabilityFilterPoolRow[]> {
  const radiusKm = input.radiusKm ?? DEFAULT_MOBILITY_RADIUS_KM
  const pool = await filterStore.listBySlot(input)
  const kept: AvailabilityFilterPoolRow[] = []
  for (const row of pool) {
    if (await withinRadius(row, input.city, radiusKm, lookupGeo)) kept.push(row)
  }
  return kept
}
