import { describe, expect, it } from 'vitest'
import { linkDevisField, toDevisFormValues } from './devis-form'

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

describe('linkDevisField', () => {
  it('derives the hourly rate when HT and hours are typed', () => {
    const next = linkDevisField(
      { kind: 'CDI', hours: 35, hourlyRate: null, amountHt: 350, htSource: 'TYPED' },
      'amountHt',
    )
    expect(next.hourlyRate).toBe(10)
  })
})
