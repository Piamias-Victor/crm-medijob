import { DEFAULT_MOBILITY_RADIUS_KM } from '@/view-models/candidate-mobility'
import type { GeoLookup } from '@/server/matching/distance'
import type { AvailabilitySearchFilters } from '@/view-models/weekly-availability-search.schema'
import { withinRadius } from './filter-available'
import type {
  DeclaredAvailabilityPoolRow,
  DeclaredAvailabilityQuery,
  WeeklyAvailabilityDeclaredStore,
} from './filter-pool'

type Params = {
  store: WeeklyAvailabilityDeclaredStore
  lookupGeo: GeoLookup
  input: AvailabilitySearchFilters
  today: Date
}

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function matchesQuery(row: DeclaredAvailabilityPoolRow, q: string | undefined): boolean {
  if (!q) return true
  const needle = normalize(q)
  return [row.firstName, row.lastName, row.city, row.jobTitleName].some((field) =>
    field ? normalize(field).includes(needle) : false,
  )
}

function toQuery(input: AvailabilitySearchFilters, today: Date): DeclaredAvailabilityQuery {
  const todayYmd = today.toISOString().slice(0, 10)
  const query: DeclaredAvailabilityQuery = {
    from: input.dateFrom && input.dateFrom > todayYmd ? input.dateFrom : todayYmd,
  }
  if (input.dateTo) query.dateTo = input.dateTo
  if (input.period) query.period = input.period
  if (input.jobTitleIds?.length) query.jobTitleIds = input.jobTitleIds
  query.hasDispo = input.hasDispo ?? 'yes'
  return query
}

export async function searchDeclared({
  store,
  lookupGeo,
  input,
  today,
}: Params): Promise<DeclaredAvailabilityPoolRow[]> {
  const pool = await store.listDeclared(toQuery(input, today))
  const named = pool.filter((row) => matchesQuery(row, input.q))
  if (!input.city) return named
  const radiusKm = input.radiusKm ?? DEFAULT_MOBILITY_RADIUS_KM
  const kept: DeclaredAvailabilityPoolRow[] = []
  for (const row of named) {
    if (await withinRadius(row, input.city, radiusKm, lookupGeo)) kept.push(row)
  }
  return kept
}
