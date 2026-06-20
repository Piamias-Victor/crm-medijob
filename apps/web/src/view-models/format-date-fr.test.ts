import { describe, it, expect } from 'vitest'
import { formatDateFr } from '@/view-models/format-date-fr'

describe('formatDateFr', () => {
  it('formats dates in French locale', () => {
    expect(formatDateFr(new Date('2026-03-01T12:00:00Z'))).toMatch(/2026/)
  })
})
