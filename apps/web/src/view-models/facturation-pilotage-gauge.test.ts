import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { annualFromMonthly, DEFAULT_OBJECTIF } from '@/view-models/objectif'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

describe('buildPilotage gauge', () => {
  it('treats a zero-CA zero-Marge Placement as NoGo and keeps Réalisé at 0', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'zero', amountHt: 0, marge: 0 })],
      [],
      { exercice: 'all' },
    )
    expect(result.gauge).toMatchObject({
      billedCa: 0,
      nogoCount: 1,
      lostCa: 0,
      cap: annualFromMonthly(DEFAULT_OBJECTIF.monthlyCaPlacement),
      realisePct: 0,
      potentielPct: 0,
      resteAFaire: 240_000,
    })
  })

  it('sets Réalisé % to billed Placement CA over 12 × monthly Objectif', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'ok', amountHt: 48_000, marge: 10_000 })],
      [],
      { exercice: 'all' },
    )
    expect(result.gauge).toMatchObject({
      billedCa: 48_000,
      nogoCount: 0,
      cap: 240_000,
      realisePct: 20,
      potentielPct: 20,
      resteAFaire: 192_000,
    })
  })

  it('projects lost CA as NoGo count × average billed CA of that type', () => {
    const billed = pilotageLine({
      id: 'cdi-ok',
      placementContractType: 'CDI',
      amountHt: 10_000,
      marge: 2_000,
    })
    const nogo = pilotageLine({
      id: 'cdi-zero',
      placementContractType: 'CDI',
      amountHt: 0,
      marge: 0,
    })
    const result = buildPilotage([billed, nogo], [], { exercice: 'all' })
    expect(result.gauge).toMatchObject({
      billedCa: 10_000,
      nogoCount: 1,
      lostCa: 10_000,
      realisePct: 4.2,
      potentielPct: 8.3,
    })
  })
})
