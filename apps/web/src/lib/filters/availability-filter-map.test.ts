// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { toAvailabilitySearchFilters } from '@/lib/filters/availability-filter-map'
import type { AvailabilityFilterValues } from '@/lib/filters/availability-filter-config'

const empty: AvailabilityFilterValues = {
  q: '',
  metier: [],
  dispos: '',
  dates: { from: '', to: '' },
  creneau: '',
  ville: '',
  rayon: '',
}

describe('toAvailabilitySearchFilters', () => {
  it('sends nothing when the bar is untouched', () => {
    expect(toAvailabilitySearchFilters(empty)).toEqual({})
  })

  it('maps every filled field to its API name', () => {
    expect(
      toAvailabilitySearchFilters({
        ...empty,
        q: ' margo ',
        metier: ['jt1'],
        dates: { from: '2026-09-07', to: '2026-09-11' },
        creneau: 'AM',
        ville: 'Lyon',
        rayon: '25',
      }),
    ).toEqual({
      q: 'margo',
      jobTitleIds: ['jt1'],
      dateFrom: '2026-09-07',
      dateTo: '2026-09-11',
      period: 'AM',
      city: 'Lyon',
      radiusKm: 25,
    })
  })

  it('maps dispos select to hasDispo', () => {
    expect(toAvailabilitySearchFilters({ ...empty, dispos: 'no' })).toEqual({ hasDispo: 'no' })
    expect(toAvailabilitySearchFilters({ ...empty, dispos: 'all' })).toEqual({ hasDispo: 'all' })
  })
})
