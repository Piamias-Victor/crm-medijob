import { describe, it, expect } from 'vitest'
import {
  WEEKDAY_LABELS,
  formatDisplayDate,
  formatIsoDate,
  parseIsoDate,
} from '@/lib/date-picker-utils'

describe('date-picker-utils', () => {
  it('formats and parses ISO dates', () => {
    const date = new Date(2026, 5, 18)
    expect(formatIsoDate(date)).toBe('2026-06-18')
    expect(parseIsoDate('2026-06-18')?.getDate()).toBe(18)
  })

  it('shows immediate availability when empty', () => {
    expect(formatDisplayDate(undefined)).toBe('Disponible immédiatement')
  })

  it('uses unique weekday labels for calendar headers', () => {
    expect(new Set(WEEKDAY_LABELS).size).toBe(WEEKDAY_LABELS.length)
    expect(WEEKDAY_LABELS).toHaveLength(7)
  })
})
