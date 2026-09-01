// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanEnterpriseRouter } from './badakan-enterprise'
import type { BadakanEnterpriseDeps } from './badakan-enterprise.deps'
import type { EnterpriseVerifyRow } from '@/server/badakan-enterprise/verify.types'

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

describe('badakanEnterpriseRouter', () => {
  it('lists pending enterprises for the verification queue', async () => {
    const rows = await caller(makeDeps()).listPending()
    expect(rows[0]).toMatchObject({
      name: 'Pharmacie Hermes',
      href: '/interim/officines/row1',
    })
  })

  it('previews a new SIRET as Nouvelle Pharmacy', async () => {
    const preview = await caller(makeDeps()).getPreview({ id: 'row1' })
    expect(preview?.statusLabel).toBe('Nouvelle Pharmacy')
    expect(preview?.contactActionLabel).toBe('Créer le Contact principal')
  })

  it('confirms a new SIRET by creating Pharmacy and Contact', async () => {
    const deps = makeDeps()
    const result = await caller(deps).confirm({ id: 'row1' })
    expect(deps.createPharmacy).toHaveBeenCalled()
    expect(deps.createContact).toHaveBeenCalled()
    expect(result.pharmacyId).toBe('p-new')
    expect(result.createdPharmacy).toBe(true)
  })

  it('confirms an existing SIRET without a second Pharmacy', async () => {
    const deps = makeDeps({
      findIdentityBySiret: vi.fn().mockResolvedValue({
        id: 'p-exist',
        name: 'Hermes CRM',
        siret: '12345678901234',
      }),
    })
    const result = await caller(deps).confirm({ id: 'row1' })
    expect(deps.createPharmacy).not.toHaveBeenCalled()
    expect(result.pharmacyId).toBe('p-exist')
    expect(result.createdPharmacy).toBe(false)
  })
})
