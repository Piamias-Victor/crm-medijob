import { weeklyAvailabilityFilterInputSchema } from './weekly-availability-filter.schema'
import { DEFAULT_MOBILITY_RADIUS_KM } from './candidate-mobility'

type Params = Record<string, string | string[] | undefined>

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function parseAvailabilityFilter(params: Params) {
  const radiusRaw = first(params.radiusKm)
  const parsed = weeklyAvailabilityFilterInputSchema.safeParse({
    date: first(params.date),
    period: first(params.period),
    jobTitleId: first(params.jobTitleId),
    city: first(params.city),
    radiusKm: radiusRaw ? Number(radiusRaw) : undefined,
  })
  return parsed.success ? parsed.data : null
}

export type AvailabilityFilterFormValues = {
  date: string
  period: 'AM' | 'PM'
  jobTitleId: string
  city: string
  radiusKm: number
}

export function filterFormValues(
  filter: ReturnType<typeof parseAvailabilityFilter>,
): AvailabilityFilterFormValues {
  return {
    date: filter?.date ?? '',
    period: filter?.period ?? 'AM',
    jobTitleId: filter?.jobTitleId ?? '',
    city: filter?.city ?? '',
    radiusKm: filterRadiusValue(filter?.radiusKm),
  }
}

export function filterRadiusValue(radiusKm: number | undefined): number {
  return radiusKm ?? DEFAULT_MOBILITY_RADIUS_KM
}
