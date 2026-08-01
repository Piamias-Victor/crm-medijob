import { describe, it, expect } from 'vitest'
import { toPharmacyQuickView } from '@/view-models/pharmacy-quick-view'
import { pharmacyQuickViewEntity } from '@/view-models/pharmacy-quick-view.test-fixtures'

describe('toPharmacyQuickView', () => {
  it('maps coords, primary contacts, open needs and last action', () => {
    const view = toPharmacyQuickView(pharmacyQuickViewEntity)

    expect(view).toMatchObject({
      id: 'p1',
      name: 'Pharmacie du Centre',
      coordinates: { city: 'Paris', postalCode: '75002' },
      primaryContacts: [{ id: 'c1', fullName: 'Marie Curie' }],
      openNeeds: [{ id: 'm1', title: 'Remplacement été', jobTitle: 'Pharmacien' }],
      lastAction: { typeLabel: 'Appel', content: 'Rappel titulaire', authorName: 'Alice' },
    })
    expect(view.lastAction?.dateLabel).toMatch(/2026/)
  })

  it('returns null lastAction and empty lists when missing', () => {
    const view = toPharmacyQuickView({
      ...pharmacyQuickViewEntity,
      contacts: [],
      missions: [],
      lastActivity: null,
    })

    expect(view.primaryContacts).toEqual([])
    expect(view.openNeeds).toEqual([])
    expect(view.lastAction).toBeNull()
  })
})
