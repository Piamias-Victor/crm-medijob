// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { buildMissionFilterConfig } from '@/lib/filters/mission-filter-config'
import { toMissionListFilters } from '@/lib/filters/mission-filter-map'

const config = buildMissionFilterConfig(
  [{ id: 'p1', name: 'Pharmacie Centre' }],
  [{ id: 'jt1', name: 'Pharmacien' }],
  [{ id: 'u1', name: 'Alice' }],
)
const defaults = buildDefaultFilterValues(config)

describe('toMissionListFilters', () => {
  it('mappe la searchbar q trimée', () => {
    expect(toMissionListFilters({ ...defaults, q: '  Centre  ' })).toEqual({ q: 'Centre' })
  })
})
