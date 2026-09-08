import { describe, expect, it, vi } from 'vitest'
import { promoteReadyEnterprises } from './promote-ready'
import type { ConfirmVerifyDeps } from './confirm-verify'
import type { EnterpriseVerifyRow } from './verify.types'

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

describe('promoteReadyEnterprises', () => {
  it('creates a pharmacie when SIRET is present and unused', async () => {
    const d = deps()
    const result = await promoteReadyEnterprises({
      ...d,
      listPending: async () => [hermes],
    })
    expect(d.createPharmacy).toHaveBeenCalled()
    expect(d.markVerified).toHaveBeenCalledWith('row1', 'p-new')
    expect(result).toEqual({ created: 1, skipped: 0 })
  })

  it('leaves the row pending when SIRET is missing', async () => {
    const d = deps()
    const result = await promoteReadyEnterprises({
      ...d,
      listPending: async () => [{ ...hermes, siret: null }],
    })
    expect(d.createPharmacy).not.toHaveBeenCalled()
    expect(d.markVerified).not.toHaveBeenCalled()
    expect(result).toEqual({ created: 0, skipped: 1 })
  })

  it('leaves the row pending when SIRET already exists in the CRM', async () => {
    const d = deps({
      findIdentityBySiret: async () => ({
        id: 'p-exist',
        name: 'Hermes CRM',
        siret: '12345678901234',
      }),
    })
    const result = await promoteReadyEnterprises({
      ...d,
      listPending: async () => [hermes],
    })
    expect(d.createPharmacy).not.toHaveBeenCalled()
    expect(d.markVerified).not.toHaveBeenCalled()
    expect(result).toEqual({ created: 0, skipped: 1 })
  })
})
