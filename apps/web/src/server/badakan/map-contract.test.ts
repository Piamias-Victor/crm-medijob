import { describe, expect, it } from 'vitest'
import { mapBadakanContract } from './map-contract'

const lucieRaw = {
  id: 'c-lucie',
  currentStep: 'VALIDATED',
  pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
  dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
  recipient: { firstName: 'Lucie', lastName: 'Robert' },
  enterprise: { enterpriseName: 'Pharmacie Hermes' },
}

describe('mapBadakanContract', () => {
  it('maps status, PDF, DPAE, recipient and pharmacy — not a Ligne de suivi', () => {
    const mapped = mapBadakanContract(lucieRaw)
    expect(mapped).toEqual({
      badakanId: 'c-lucie',
      status: 'VALIDATED',
      pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
      dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
      recipientName: 'Lucie Robert',
      pharmacyName: 'Pharmacie Hermes',
    })
  })

  it('returns null without an id', () => {
    expect(mapBadakanContract({ currentStep: 'CREATED' })).toBeNull()
  })

  it('reads PDF/DPAE from nested file urls when top-level strings missing', () => {
    const mapped = mapBadakanContract({
      id: 42,
      status: 'CREATED',
      contractFile: { url: 'https://files.badakan.test/nested.pdf' },
      dpaeFile: { url: 'https://files.badakan.test/nested-dpae.pdf' },
    })
    expect(mapped).toMatchObject({
      badakanId: '42',
      status: 'CREATED',
      pdfUrl: 'https://files.badakan.test/nested.pdf',
      dpaeUrl: 'https://files.badakan.test/nested-dpae.pdf',
    })
  })
})
