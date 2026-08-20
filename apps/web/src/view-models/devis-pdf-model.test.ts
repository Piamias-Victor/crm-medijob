import { describe, expect, it } from 'vitest'
import { buildDevisPdfModel, contactDisplayName } from './devis-pdf-model'

describe('buildDevisPdfModel', () => {
  it('fills destinataire from Pharmacy and Contact', () => {
    const model = buildDevisPdfModel({
      pharmacyName: 'Pharmacie du Centre',
      contactName: contactDisplayName({ firstName: 'Marie', lastName: 'Curie' }),
      kind: 'INTERIM',
      hours: 151.67,
      hourlyRate: 28,
      amountHt: 4246.76,
      amountTtc: 5096.11,
      missionTitle: 'Remplacement',
    })
    expect(model.destinataire.pharmacyName).toBe('Pharmacie du Centre')
    expect(model.destinataire.contactName).toBe('Marie Curie')
    expect(model.kindLabel).toBe('Intérim')
    expect(model.amountHt).toBe(4246.76)
    expect(model.amountTtc).toBe(5096.11)
  })

  it('builds a quote line, TVA and issue date', () => {
    const model = buildDevisPdfModel({
      pharmacyName: 'Pharmacie du Centre',
      contactName: 'Marie Curie',
      kind: 'INTERIM',
      hours: 151.67,
      hourlyRate: 28,
      amountHt: 4246.76,
      amountTtc: 5096.11,
      missionTitle: 'Remplacement',
      issuedAt: new Date(2026, 7, 20),
    })
    expect(model.issuedLabel).toBe('20/08/2026')
    expect(model.tvaAmount).toBe(849.35)
    expect(model.line).toEqual({
      designation: 'Mission Intérim — Remplacement',
      quantity: '151,67 h',
      unitPrice: '28,00 €',
      totalHt: '4 246,76 €',
    })
  })
})
