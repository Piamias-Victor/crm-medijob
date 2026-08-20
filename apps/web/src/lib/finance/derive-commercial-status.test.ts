import { describe, expect, it } from 'vitest'
import { deriveCommercialStatus } from './derive-commercial-status'

describe('deriveCommercialStatus', () => {
  it('is Sans devis when nothing was sent', () => {
    expect(deriveCommercialStatus(null)).toBe('SANS_DEVIS')
  })

  it('is Envoyé when the current Devis is SENT', () => {
    expect(deriveCommercialStatus({ status: 'SENT', invoicedAt: null })).toBe('ENVOYE')
  })

  it('is Accepté when the current Devis is ACCEPTED', () => {
    expect(deriveCommercialStatus({ status: 'ACCEPTED', invoicedAt: null })).toBe('ACCEPTE')
  })

  it('is Facturé when the accepted Devis has invoicedAt', () => {
    expect(
      deriveCommercialStatus({ status: 'ACCEPTED', invoicedAt: new Date('2026-08-21') }),
    ).toBe('FACTURE')
  })
})
