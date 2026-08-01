import { describe, expect, it } from 'vitest'
import { computeFillRate } from './dashboard-fill-rate'

describe('computeFillRate', () => {
  it('returns 0 when no eligible missions', () => {
    expect(computeFillRate(0, 0)).toBe(0)
  })

  it('returns percent of POURVU over eligible stock', () => {
    expect(computeFillRate(1, 4)).toBe(25)
    expect(computeFillRate(3, 3)).toBe(100)
  })
})
