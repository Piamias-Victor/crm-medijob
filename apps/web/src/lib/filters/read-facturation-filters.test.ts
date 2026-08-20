import { describe, expect, it } from 'vitest'
import { readFacturationOverviewFilters } from '@/lib/filters/read-facturation-filters'

describe('readFacturationOverviewFilters', () => {
  it('defaults acceptedAt to the current month', () => {
    const { serverFilters } = readFacturationOverviewFilters({}, [], [], new Date(2026, 7, 20))
    expect(serverFilters).toEqual({
      acceptedFrom: '2026-08-01',
      acceptedTo: '2026-08-31',
    })
  })
})
