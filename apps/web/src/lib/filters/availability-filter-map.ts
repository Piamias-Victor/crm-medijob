import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import type {
  AvailabilityFilterConfig,
  AvailabilityFilterValues,
} from '@/lib/filters/availability-filter-config'
import type { AvailabilitySearchFilters } from '@/view-models/weekly-availability-search.schema'

function radius(raw: string): number | undefined {
  const parsed = Number(raw.trim())
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 500) return undefined
  return parsed
}

export function toAvailabilitySearchFilters(
  values: AvailabilityFilterValues,
): AvailabilitySearchFilters {
  const filters: AvailabilitySearchFilters = {}
  const q = values.q.trim()
  const city = values.ville.trim()
  if (q) filters.q = q
  if (values.metier.length) filters.jobTitleIds = values.metier
  if (values.dates.from) filters.dateFrom = values.dates.from
  if (values.dates.to) filters.dateTo = values.dates.to
  if (values.creneau === 'AM' || values.creneau === 'PM') filters.period = values.creneau
  if (city) filters.city = city
  const radiusKm = radius(values.rayon)
  if (radiusKm) filters.radiusKm = radiusKm
  if (values.dispos === 'all' || values.dispos === 'yes' || values.dispos === 'no') {
    filters.hasDispo = values.dispos
  }
  return filters
}

export function toAvailabilityFilterValues(
  config: AvailabilityFilterConfig,
  server: AvailabilitySearchFilters,
): AvailabilityFilterValues {
  const defaults = buildDefaultFilterValues(config)
  return {
    ...defaults,
    q: server.q ?? '',
    metier: server.jobTitleIds ?? [],
    dispos: server.hasDispo ?? '',
    dates: { from: server.dateFrom ?? '', to: server.dateTo ?? '' },
    creneau: server.period ?? '',
    ville: server.city ?? '',
    rayon: server.radiusKm ? String(server.radiusKm) : '',
  }
}
