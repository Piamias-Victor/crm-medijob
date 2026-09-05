// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { halfDayCountLabel } from '@/view-models/weekly-availability-count'

describe('halfDayCountLabel', () => {
  it('names an empty planning', () => {
    expect(halfDayCountLabel(0)).toBe('Aucun créneau')
  })

  it('keeps the singular for one half-day', () => {
    expect(halfDayCountLabel(1)).toBe('1 créneau')
  })

  it('pluralises beyond one', () => {
    expect(halfDayCountLabel(12)).toBe('12 créneaux')
  })
})
