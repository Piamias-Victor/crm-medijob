import { describe, expect, it } from 'vitest'
import { previewEnterpriseVerify } from './preview-verify'
import type { EnterpriseVerifyRow } from './verify.types'

const hermes: EnterpriseVerifyRow = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siret: '123 456 789 01234',
  address: '1 rue de la Paix',
  city: 'Paris',
  postalCode: '75001',
  principalFirstName: 'Dominique',
  principalLastName: 'Litzler',
  principalEmail: 'd.litzler@hermes.fr',
  principalPhone: '0601020304',
  pharmacyId: null,
  verifiedAt: null,
}

describe('previewEnterpriseVerify', () => {
  it('shows the existing Pharmacy when SIRET matches', async () => {
    const existing = {
      id: 'p-exist',
      name: 'Pharmacie Hermes CRM',
      siret: '12345678901234',
    }
    const preview = await previewEnterpriseVerify(hermes, {
      findIdentityBySiret: async () => existing,
      listContacts: async () => [],
    })
    expect(preview.existingPharmacy).toEqual(existing)
  })

  it('proposes the Contact matched by email on that Pharmacy', async () => {
    const preview = await previewEnterpriseVerify(hermes, {
      findIdentityBySiret: async () => ({
        id: 'p-exist',
        name: 'Hermes',
        siret: '12345678901234',
      }),
      listContacts: async () => [
        { id: 'c-dom', email: 'd.litzler@hermes.fr', phone: null },
      ],
    })
    expect(preview.contactMatch).toMatchObject({ id: 'c-dom', reason: 'email' })
  })

  it('proposes the Contact matched by phone when email misses', async () => {
    const preview = await previewEnterpriseVerify(
      { ...hermes, principalEmail: null },
      {
        findIdentityBySiret: async () => ({
          id: 'p-exist',
          name: 'Hermes',
          siret: '12345678901234',
        }),
        listContacts: async () => [
          { id: 'c-dom', email: null, phone: '06 01 02 03 04' },
        ],
      },
    )
    expect(preview.contactMatch).toMatchObject({ id: 'c-dom', reason: 'phone' })
  })

  it('has no existing Pharmacy when SIRET is new', async () => {
    const preview = await previewEnterpriseVerify(hermes, {
      findIdentityBySiret: async () => null,
      listContacts: async () => [{ id: 'c-x', email: 'x@y.fr', phone: null }],
    })
    expect(preview.existingPharmacy).toBeNull()
    expect(preview.contactMatch).toBeNull()
  })
})
