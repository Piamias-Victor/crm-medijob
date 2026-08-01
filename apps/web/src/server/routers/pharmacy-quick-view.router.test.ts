// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { makeDeps, pharmacyCaller } from '@/server/routers/pharmacy.test.deps'

describe('pharmacyRouter.quickView', () => {
  it('returns pharmacy quick view payload by id', async () => {
    const view = await pharmacyCaller(makeDeps()).quickView({ id: 'p1' })
    expect(view).toMatchObject({
      id: 'p1',
      name: 'Pharmacie du Centre',
      coordinates: { city: 'Paris', postalCode: '75002' },
      primaryContacts: [{ fullName: 'Marie Curie' }],
      openNeeds: [{ title: 'CDI', jobTitle: 'Pharmacien' }],
      lastAction: { typeLabel: 'Note', content: 'Fiche créée', authorName: 'Système' },
    })
  })
})
