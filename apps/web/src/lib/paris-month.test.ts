// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { adjacentMonth, currentMonth, monthOf, monthWeekStarts } from '@/lib/paris-month'

describe('paris-month', () => {
  it('lists the mondays covering september 2026', () => {
    expect(monthWeekStarts('2026-09')).toEqual([
      '2026-08-31',
      '2026-09-07',
      '2026-09-14',
      '2026-09-21',
      '2026-09-28',
    ])
  })

  it('wraps the year on adjacent months', () => {
    expect(adjacentMonth('2026-12', 1)).toBe('2027-01')
    expect(adjacentMonth('2026-01', -1)).toBe('2025-12')
  })

  it('reads the Paris month of a date', () => {
    expect(currentMonth(new Date('2026-09-03T22:30:00.000Z'))).toBe('2026-09')
    expect(monthOf('2026-09-30')).toBe('2026-09')
  })
})
