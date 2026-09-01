import { describe, expect, it, vi } from 'vitest'
import { confirmEnterpriseVerify } from './confirm-verify'
import type { EnterpriseVerifyRow } from './verify.types'
import type { ConfirmVerifyDeps } from './confirm-verify'

const hermes: EnterpriseVerifyRow = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siret: '12345678901234',
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

function deps(overrides: Partial<ConfirmVerifyDeps> = {}): ConfirmVerifyDeps {
  return {
    findIdentityBySiret: async () => null,
    listContacts: async () => [],
    createPharmacy: vi.fn().mockResolvedValue({ id: 'p-new' }),
    createContact: vi.fn().mockResolvedValue({ id: 'c-new' }),
    setPrimary: vi.fn(),
    findTitulaireRoleId: async () => 'role-titulaire',
    markVerified: vi.fn(),
    ...overrides,
  }
}

describe('confirmEnterpriseVerify', () => {
  it('creates a Pharmacy when SIRET is new', async () => {
    const d = deps()
    const result = await confirmEnterpriseVerify(hermes, d)
    expect(d.createPharmacy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Pharmacie Hermes', siret: '12345678901234' }),
    )
    expect(result.pharmacyId).toBe('p-new')
    expect(result.createdPharmacy).toBe(true)
    expect(d.markVerified).toHaveBeenCalledWith('row1', 'p-new')
  })

  it('reuses the existing Pharmacy when SIRET matches', async () => {
    const d = deps({
      findIdentityBySiret: async () => ({
        id: 'p-exist',
        name: 'Hermes CRM',
        siret: '12345678901234',
      }),
    })
    const result = await confirmEnterpriseVerify(hermes, d)
    expect(d.createPharmacy).not.toHaveBeenCalled()
    expect(result.pharmacyId).toBe('p-exist')
    expect(result.createdPharmacy).toBe(false)
    expect(d.markVerified).toHaveBeenCalledWith('row1', 'p-exist')
  })

  it('links Contact by email instead of creating a duplicate', async () => {
    const d = deps({
      findIdentityBySiret: async () => ({
        id: 'p-exist',
        name: 'Hermes',
        siret: '12345678901234',
      }),
      listContacts: async () => [
        { id: 'c-dom', email: 'd.litzler@hermes.fr', phone: null },
      ],
    })
    const result = await confirmEnterpriseVerify(hermes, d)
    expect(d.createContact).not.toHaveBeenCalled()
    expect(d.setPrimary).toHaveBeenCalledWith('c-dom')
    expect(result.contactId).toBe('c-dom')
    expect(result.createdContact).toBe(false)
  })

  it('creates Contact principal when nothing matches', async () => {
    const d = deps()
    const result = await confirmEnterpriseVerify(hermes, d)
    expect(d.createContact).toHaveBeenCalledWith(
      expect.objectContaining({
        pharmacyId: 'p-new',
        firstName: 'Dominique',
        lastName: 'Litzler',
        email: 'd.litzler@hermes.fr',
        isPrimary: true,
        contactRoleId: 'role-titulaire',
      }),
    )
    expect(result.contactId).toBe('c-new')
    expect(result.createdContact).toBe(true)
  })
})
