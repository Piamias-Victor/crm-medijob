import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { annualFromMonthly, DEFAULT_OBJECTIF } from '@/view-models/objectif'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const now = new Date('2026-08-24T00:00:00Z')

describe('buildPilotage charts', () => {
  it('builds 12 Exercice months of stacked CA with monthly Objectif and cumul', () => {
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
    expect(result.charts.ca).toHaveLength(12)
    expect(result.charts.ca[0]).toMatchObject({
      month: '2025-10',
      placementCa: 0,
      interimCa: 0,
      objectif: DEFAULT_OBJECTIF.monthlyCaPlacement + DEFAULT_OBJECTIF.monthlyCaInterim,
      cumul: 0,
    })
    const aug = result.charts.ca.find((row) => row.month === '2026-08')
    expect(aug).toMatchObject({
      month: '2026-08',
      placementCa: 5_000,
      interimCa: 3_000,
      objectif: 50_000,
      cumul: 8_000,
    })
    expect(result.charts.ca.at(-1)?.cumul).toBe(8_000)
  })

  it('builds Marge vs monthly threshold and cumul vs 12 × threshold', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'p', amountHt: 5_000, marge: 1_500, occurredAt: new Date('2026-08-01T00:00:00Z') })],
      [],
      { exercice: '2025' },
      now,
    )
    const aug = result.charts.marge.find((row) => row.month === '2026-08')
    expect(aug).toMatchObject({
      month: '2026-08',
      marge: 1_500,
      seuil: DEFAULT_OBJECTIF.monthlyRentabilityThreshold,
      cumul: 1_500,
      cumulSeuil: annualFromMonthly(DEFAULT_OBJECTIF.monthlyRentabilityThreshold),
    })
    expect(result.charts.marge).toHaveLength(12)
    expect(result.charts.marge[0]).toMatchObject({ month: '2025-10', marge: 0, cumul: 0 })
  })
})
