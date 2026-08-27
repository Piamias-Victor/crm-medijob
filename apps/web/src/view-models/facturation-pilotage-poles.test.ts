import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { DEFAULT_OBJECTIF } from '@/view-models/objectif'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const now = new Date('2026-08-24T00:00:00Z')

describe('buildPilotage poles', () => {
  it('buckets Placement and Intérim by Exercice month including zeros', () => {
    const result = buildPilotage(
      [
        pilotageLine({ id: 'p', amountHt: 5_000, marge: 1_500, occurredAt: new Date('2026-08-01T00:00:00Z') }),
        pilotageLine({
          id: 'i',
          kind: 'INTERIM',
          amountHt: 3_000,
          marge: 900,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
      ],
      [],
      { exercice: '2025' },
      now,
    )
    expect(result.poles.placement.months).toHaveLength(12)
    expect(result.poles.placement.months[0]).toEqual({ month: '2025-10', ca: 0, marge: 0 })
    expect(result.poles.placement.months.at(-1)).toEqual({ month: '2026-09', ca: 0, marge: 0 })
    expect(result.poles.placement.months.find((row) => row.month === '2026-08')).toEqual({
      month: '2026-08',
      ca: 5_000,
      marge: 1_500,
    })
    expect(result.poles.interim.months.find((row) => row.month === '2026-08')).toEqual({
      month: '2026-08',
      ca: 3_000,
      marge: 900,
    })
    expect(result.poles.placement.annualCa).toBe(5_000)
    expect(result.poles.interim.annualCa).toBe(3_000)
    expect(result.poles.monthly).toEqual({
      caPlacement: DEFAULT_OBJECTIF.monthlyCaPlacement,
      margePlacement: DEFAULT_OBJECTIF.monthlyMargePlacement,
      caInterim: DEFAULT_OBJECTIF.monthlyCaInterim,
      margeInterim: DEFAULT_OBJECTIF.monthlyMargeInterim,
    })
  })

  it('buckets months when Exercice is Tous so Mois can match Annuel', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'p', amountHt: 3_120, marge: 1_150 })],
      [],
      { exercice: 'all' },
      now,
    )
    expect(result.months).toEqual(['2026-08'])
    expect(result.poles.placement.months).toEqual([{ month: '2026-08', ca: 3_120, marge: 1_150 }])
    expect(result.poles.monthly.caPlacement).toBe(DEFAULT_OBJECTIF.monthlyCaPlacement)
  })

  it('excludes cancelled lines from pole totals', () => {
    const result = buildPilotage(
      [
        pilotageLine({ id: 'ok' }),
        pilotageLine({ id: 'ko', cancelled: true, amountHt: 9_000, marge: 100 }),
      ],
      [],
      { exercice: 'all' },
    )
    expect(result.poles.placement.annualCa).toBe(5_000)
    expect(result.poles.placement.annualMarge).toBe(1_500)
  })
})
