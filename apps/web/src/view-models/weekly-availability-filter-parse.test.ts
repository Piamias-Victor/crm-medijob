import { describe, expect, it } from 'vitest'
import {
  filterRadiusValue,
  parseAvailabilityFilter,
} from './weekly-availability-filter-parse'

describe('parseAvailabilityFilter', () => {
  it('returns null until slot, JobTitle and city are set', () => {
    expect(parseAvailabilityFilter({})).toBeNull()
    expect(parseAvailabilityFilter({ date: '2026-09-02', period: 'AM' })).toBeNull()
  })

  it('parses filter and defaults radius display to 30 km', () => {
    const parsed = parseAvailabilityFilter({
      date: '2026-09-02',
      period: 'AM',
      jobTitleId: 'jt-prep',
      city: 'Lyon',
    })
    expect(parsed).toMatchObject({
      date: '2026-09-02',
      period: 'AM',
      jobTitleId: 'jt-prep',
      city: 'Lyon',
    })
    expect(parsed?.radiusKm).toBeUndefined()
    expect(filterRadiusValue(parsed?.radiusKm)).toBe(30)
  })
})
