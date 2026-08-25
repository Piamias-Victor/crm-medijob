import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

describe('buildPilotage', () => {
  it('returns zero KPIs when empty', () => {
    expect(buildPilotage([], [], { exercice: 'all' })).toMatchObject({
      kpis: {
        ca: 0,
        caPlacement: 0,
        caInterim: 0,
        marge: 0,
        margePct: 0,
        placementsActifs: 0,
        pharmaciesActives: 0,
      },
      cancelled: { count: 0, ca: 0, marge: 0 },
    })
  })

  it('books CA and Marge of an active Placement line', () => {
    expect(buildPilotage([pilotageLine({ id: 'l1' })], [], { exercice: 'all' })).toMatchObject({
      kpis: {
        ca: 5000,
        caPlacement: 5000,
        caInterim: 0,
        marge: 1500,
        margePct: 30,
        placementsActifs: 1,
        pharmaciesActives: 1,
      },
    })
  })

  it('excludes cancelled lines from KPIs and fills the banner', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'ok' }), pilotageLine({ id: 'ko', cancelled: true, amountHt: 2000, marge: 400 })],
      [],
      { exercice: 'all' },
    )
    expect(result.kpis).toMatchObject({ ca: 5000, placementsActifs: 1, pharmaciesActives: 1 })
    expect(result.cancelled).toEqual({ count: 1, ca: 2000, marge: 400 })
  })
})
