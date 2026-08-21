import { describe, expect, it } from 'vitest'
import { toMissionQuoteState } from './mission-quote-state'
import type { DevisView } from './devis'

const accepted: DevisView = {
  id: 'd1',
  kind: 'CDD',
  status: 'ACCEPTED',
  hours: null,
  hourlyRate: null,
  amountHt: 3000,
  amountTtc: 3600,
  htSource: 'TYPED',
  acceptedAt: new Date('2026-08-20'),
  invoicedAt: null,
}

describe('toMissionQuoteState', () => {
  it('exposes CA and Accepté after accept', () => {
    const state = toMissionQuoteState('EN_RECHERCHE', accepted)
    expect(state.commercialStatus).toBe('ACCEPTE')
    expect(state.ca).toBe(3000)
    expect(state.canAccept).toBe(false)
    expect(state.canSend).toBe(false)
    expect(state.canInvoice).toBe(true)
  })

  it('lets a lone DRAFT be sent or accepted', () => {
    const draft = { ...accepted, status: 'DRAFT' as const, acceptedAt: null }
    const state = toMissionQuoteState('EN_RECHERCHE', draft)
    expect(state.canAccept).toBe(true)
    expect(state.canSend).toBe(true)
    expect(state.ca).toBe(0)
  })
})
