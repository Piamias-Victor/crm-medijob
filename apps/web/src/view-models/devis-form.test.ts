import { describe, expect, it } from 'vitest'
import { toDevisFormValues } from './devis-form'

describe('toDevisFormValues', () => {
  it('defaults kind and hours from the Mission when no draft exists', () => {
    expect(toDevisFormValues(null, { contractType: 'CDD', hours: 35 })).toEqual({
      kind: 'CDD',
      hours: 35,
      hourlyRate: null,
      amountHt: null,
      htSource: 'TYPED',
    })
  })
})
