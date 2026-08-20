import { describe, expect, it } from 'vitest'
import { applyLinkedAmounts, type DevisDraftState } from './devis-draft'

const base = (patch: Partial<DevisDraftState>): DevisDraftState => ({
  kind: 'CDI',
  hours: 35,
  hourlyRate: null,
  amountHt: null,
  amountTtc: null,
  htSource: 'TYPED',
  ...patch,
})

describe('devis linked amounts', () => {
  it('fills HT from hours × rate', () => {
    const next = applyLinkedAmounts(base({ hourlyRate: 10 }), 'hourlyRate')
    expect(next.amountHt).toBe(350)
    expect(next.amountTtc).toBe(420)
  })

  it('fills rate from HT ÷ hours', () => {
    expect(applyLinkedAmounts(base({ amountHt: 350 }), 'amountHt').hourlyRate).toBe(10)
  })

  it('recalculates HT when hours change if a rate is set', () => {
    const next = applyLinkedAmounts(base({ hours: 200, hourlyRate: 28, amountHt: 4500 }), 'hours')
    expect(next.amountHt).toBe(5600)
    expect(next.amountTtc).toBe(6720)
  })
})
