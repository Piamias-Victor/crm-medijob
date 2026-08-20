import { describe, expect, it } from 'vitest'
import { deriveMissionCa } from './derive-mission-finance'

describe('deriveMissionCa', () => {
  it('books CA as the accepted HT once', () => {
    expect(
      deriveMissionCa('EN_RECHERCHE', { status: 'ACCEPTED', amountHt: 3000 }),
    ).toBe(3000)
  })

  it('clears CA when the Mission is ANNULEE', () => {
    expect(
      deriveMissionCa('ANNULEE', { status: 'ACCEPTED', amountHt: 3000 }),
    ).toBe(0)
  })

  it('keeps CA at 0 until the current Devis is accepted', () => {
    expect(deriveMissionCa('EN_RECHERCHE', { status: 'SENT', amountHt: 3000 })).toBe(0)
  })
})
