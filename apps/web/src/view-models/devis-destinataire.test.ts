import { describe, expect, it } from 'vitest'
import { resolveDevisDestinataire } from './devis-destinataire'

describe('resolveDevisDestinataire', () => {
  it('prefers Mission Contact then Pharmacy primary', () => {
    const mission = { firstName: 'Marie', lastName: 'Curie', email: null }
    const primary = { firstName: 'Paul', lastName: 'Bert', email: 'paul@pharma.fr' }
    expect(resolveDevisDestinataire(mission, primary)).toEqual({
      contactName: 'Marie Curie',
      email: 'paul@pharma.fr',
    })
  })
})
