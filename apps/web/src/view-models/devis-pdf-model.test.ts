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
})
