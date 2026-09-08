// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanEnterpriseRouter } from './badakan-enterprise'
import type { BadakanEnterpriseDeps } from './badakan-enterprise.deps'
import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'

const hermes: EnterpriseVerifyRow = {
  id: 'row1',
  name: 'Pharmacie Hermes',
  siret: null,
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

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<BadakanEnterpriseDeps> = {}): BadakanEnterpriseDeps {
  return {
    listPending: vi.fn().mockResolvedValue([hermes]),
    findById: vi.fn().mockResolvedValue(hermes),
    findIdentityBySiret: vi.fn().mockResolvedValue(null),
    listContacts: vi.fn().mockResolvedValue([]),
    createPharmacy: vi.fn().mockResolvedValue({ id: 'p-new' }),
    createContact: vi.fn().mockResolvedValue({ id: 'c-new' }),
    setPrimary: vi.fn(),
    findTitulaireRoleId: vi.fn().mockResolvedValue('role-titulaire'),
    markVerified: vi.fn(),
    ...overrides,
  }
}

function caller(deps: BadakanEnterpriseDeps) {
  return createCallerFactory(makeBadakanEnterpriseRouter(deps))({ session })
}

describe('badakanEnterpriseRouter SIRET queue', () => {
  it('flags a missing SIRET on the officines queue', async () => {
    const rows = await caller(makeDeps()).listPending()
    expect(rows[0]?.blockLabel).toBe('SIRET manquant')
  })

  it('creates a pharmacie from a corrected SIRET', async () => {
    const deps = makeDeps()
    const result = await caller(deps).confirm({ id: 'row1', siret: '12345678901234' })
    expect(deps.createPharmacy).toHaveBeenCalledWith(
      expect.objectContaining({ siret: '12345678901234' }),
    )
    expect(result.createdPharmacy).toBe(true)
  })

  it('rejects confirm when SIRET is still missing', async () => {
    await expect(caller(makeDeps()).confirm({ id: 'row1' })).rejects.toThrow('SIRET manquant')
  })
})
