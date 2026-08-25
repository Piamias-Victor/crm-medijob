import { describe, expect, it } from 'vitest'
import { annualFromMonthly, DEFAULT_OBJECTIF } from '@/view-models/objectif'

describe('Objectif defaults', () => {
  it('seeds monthly CA/Marge Placement, Intérim and rentability threshold', () => {
    expect(DEFAULT_OBJECTIF).toEqual({
      monthlyCaPlacement: 20_000,
      monthlyMargePlacement: 20_000,
      monthlyCaInterim: 30_000,
      monthlyMargeInterim: 10_000,
      monthlyRentabilityThreshold: 15_000,
    })
  })

  it('computes annual Objectif as 12 × monthly', () => {
    expect(annualFromMonthly(DEFAULT_OBJECTIF.monthlyCaPlacement)).toBe(240_000)
    expect(
      annualFromMonthly(
        DEFAULT_OBJECTIF.monthlyCaPlacement + DEFAULT_OBJECTIF.monthlyCaInterim,
      ),
    ).toBe(600_000)
    expect(annualFromMonthly(DEFAULT_OBJECTIF.monthlyRentabilityThreshold)).toBe(180_000)
  })
})
