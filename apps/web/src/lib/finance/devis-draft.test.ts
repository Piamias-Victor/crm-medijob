import { describe, expect, it } from 'vitest'
import {
  applyCalculate,
  applyHours,
  applyTypedHt,
  emptyInterimDraft,
  type DevisDraftState,
} from './devis-draft'

describe('devis draft amounts', () => {
  it('keeps typed HT when hours change until Calculate', () => {
    let draft = applyTypedHt(emptyInterimDraft({ hours: 151.67, hourlyRate: 28 }), 4500)
    draft = applyHours(draft, 200)
    expect(draft.amountHt).toBe(4500)
    expect(draft.hours).toBe(200)

    draft = applyCalculate(draft)
    expect(draft.amountHt).toBe(5600)
    expect(draft.amountTtc).toBe(6720)
  })

  it('keeps CDD typed forfait even if hours and rate are set', () => {
    const cdd: DevisDraftState = {
      kind: 'CDD',
      hours: 151,
      hourlyRate: 28,
      amountHt: 3000,
      amountTtc: 3600,
      htSource: 'TYPED',
    }
    expect(applyCalculate(cdd).amountHt).toBe(3000)
  })
})
