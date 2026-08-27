import { describe, expect, it } from 'vitest'
import { defaultPoleMonth, poleProgress } from '@/view-models/facturation-pilotage-pole-progress'
import { polePeriodCaption } from '@/view-models/facturation-pilotage-poles-copy'
import type { PilotagePoleSeries } from '@/view-models/facturation-pilotage-poles'

const series: PilotagePoleSeries = {
  annualCa: 9_768,
  annualMarge: 4_000,
  months: [
    { month: '2026-08', ca: 9_768, marge: 4_000 },
    { month: '2026-09', ca: 0, marge: 0 },
  ],
}

describe('poleProgress', () => {
  it('compares the selected month to the monthly Objectif', () => {
    expect(poleProgress(series, 20_000, 20_000, 'month', '2026-08')).toEqual({
      ca: 9_768,
      marge: 4_000,
      caObjectif: 20_000,
      margeObjectif: 20_000,
      caPct: 48.8,
      margePct: 20,
    })
  })

  it('compares annual totals to 12 × monthly Objectif', () => {
    expect(poleProgress(series, 20_000, 10_000, 'year', '2026-08')).toEqual({
      ca: 9_768,
      marge: 4_000,
      caObjectif: 240_000,
      margeObjectif: 120_000,
      caPct: 4.1,
      margePct: 3.3,
    })
  })

  it('defaults the pole month to the current month when it is in the Exercice', () => {
    const months = ['2025-10', '2026-08', '2026-09']
    expect(defaultPoleMonth(months, new Date('2026-08-24T00:00:00Z'))).toBe('2026-08')
    expect(defaultPoleMonth(['2026-10', '2027-09'], new Date('2026-08-24T00:00:00Z'))).toBe(
      '2027-09',
    )
  })

  it('labels Annuel vs the selected month on pole cards', () => {
    expect(polePeriodCaption('year', '2026-08')).toBe('Annuel')
    expect(polePeriodCaption('month', '2026-08')).toBe('Août 2026')
  })
})
