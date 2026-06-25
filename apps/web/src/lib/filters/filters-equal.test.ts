// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { filtersEqual } from '@/lib/filters/filters-equal'

describe('filtersEqual', () => {
  it('compare des filtres par valeur', () => {
    expect(filtersEqual({ statuses: ['ACTIF'] }, { statuses: ['ACTIF'] })).toBe(true)
    expect(filtersEqual({ statuses: ['ACTIF'] }, { statuses: ['PROSPECT'] })).toBe(false)
    expect(filtersEqual({}, {})).toBe(true)
  })
})
