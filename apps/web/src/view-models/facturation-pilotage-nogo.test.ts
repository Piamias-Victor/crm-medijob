import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { DEFAULT_OBJECTIF } from '@/view-models/objectif'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

describe('buildPilotage NoGo rules', () => {
  it('never counts Intérim as NoGo even at 0 € or cancelled', () => {
    const result = buildPilotage(
      [
        pilotageLine({ id: 'int-zero', kind: 'INTERIM', amountHt: 0, marge: 0 }),
        pilotageLine({
          id: 'int-ko',
          kind: 'INTERIM',
          amountHt: 8_000,
          marge: 1_000,
          cancelled: true,
        }),
      ],
      [],
      { exercice: 'all' },
    )
    expect(result.gauge).toMatchObject({ billedCa: 0, nogoCount: 0, lostCa: 0 })
  })

  it('projects CDD NoGo from CDD average, not CDI', () => {
    const cdi = pilotageLine({
      id: 'cdi',
      placementContractType: 'CDI',
      amountHt: 20_000,
      marge: 4_000,
    })
    const cddNogo = pilotageLine({
      id: 'cdd-zero',
      placementContractType: 'CDD',
      amountHt: 0,
      marge: 0,
    })
    expect(buildPilotage([cdi, cddNogo], [], { exercice: 'all' }).gauge).toMatchObject({
      billedCa: 20_000,
      nogoCount: 1,
      lostCa: 0,
    })
  })

  it('uses Admin Objectif monthly Placement CA × 12 as the cap', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'ok', amountHt: 12_000, marge: 3_000 })],
      [],
      { exercice: 'all' },
      new Date(),
      { ...DEFAULT_OBJECTIF, monthlyCaPlacement: 10_000 },
    )
    expect(result.gauge).toMatchObject({ cap: 120_000, billedCa: 12_000, realisePct: 10 })
  })
})
