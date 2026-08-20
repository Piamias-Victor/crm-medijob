import { describe, expect, it } from 'vitest'
import { formatDevisPdfAmount, formatDevisPdfDate, formatDevisPdfHours } from './devis-pdf-format'

describe('devis PDF format', () => {
  it('groups thousands in French euros', () => {
    expect(formatDevisPdfAmount(3000)).toBe('3 000,00 €')
    expect(formatDevisPdfAmount(4246.76)).toBe('4 246,76 €')
  })

  it('formats hours and dates for the quote', () => {
    expect(formatDevisPdfHours(151.67)).toBe('151,67 h')
    expect(formatDevisPdfDate(new Date(2026, 7, 20))).toBe('20/08/2026')
  })
})
