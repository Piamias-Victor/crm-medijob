// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makePharmacyRouter, type PharmacyDeps } from '@/server/routers/pharmacy'
import type { PharmacyListEntity } from '@/view-models/pharmacy-list'

const entity: PharmacyListEntity = {
  id: 'p1',
  name: 'Pharmacie du Centre',
  city: 'Paris',
  status: 'ACTIF',
  groupement: { name: 'Giphar' },
  contacts: [{ firstName: 'Marie', lastName: 'Curie', isPrimary: true }],
  _count: { missions: 2 },
}

function makeDeps(overrides: Partial<PharmacyDeps> = {}): PharmacyDeps {
  return {
    pharmacies: {
      list: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 'new', ...data })),
      update: vi.fn().mockResolvedValue({ id: 'p1' }),
      softDelete: vi.fn().mockResolvedValue({ id: 'p1' }),
    },
    referentials: {
      listGroupements: vi.fn().mockResolvedValue([]),
      listSoftwares: vi.fn().mockResolvedValue([]),
    },
    createGroupement: vi.fn().mockResolvedValue({ id: 'g1', name: 'Giphar' }),
    createSoftware: vi.fn().mockResolvedValue({ id: 's1', name: 'Winpharma' }),
    searchSiret: vi.fn().mockResolvedValue([{ siret: '1', name: 'X', address: '', city: '', postalCode: '' }]),
    ...overrides,
  }
}

const recruteurSession = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }
const adminSession = { user: { id: 'u2', role: 'ADMIN' as const }, expires: '2999-01-01' }

function caller(deps: PharmacyDeps, session = recruteurSession) {
  return createCallerFactory(makePharmacyRouter(deps))({ session })
}

describe('pharmacyRouter', () => {
  it('returns list rows mapped to SPEC columns', async () => {
    const rows = await caller(makeDeps()).list()
    expect(rows[0]).toMatchObject({ name: 'Pharmacie du Centre', groupementName: 'Giphar', missionCount: 2 })
  })

  it('computes numeroTVA from the SIRET on create', async () => {
    const deps = makeDeps()
    await caller(deps).create({ name: 'Test', siret: '00000000100012' })
    expect(deps.pharmacies.create).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Test', numeroTVA: 'FR15000000001' }),
    )
  })

  it('delegates SIRET search to the service', async () => {
    const deps = makeDeps()
    const res = await caller(deps).searchSiret({ query: 'pharmacie' })
    expect(deps.searchSiret).toHaveBeenCalledWith('pharmacie')
    expect(res[0].siret).toBe('1')
  })

  it('soft deletes by id', async () => {
    const deps = makeDeps()
    await caller(deps).softDelete({ id: 'p1' })
    expect(deps.pharmacies.softDelete).toHaveBeenCalledWith('p1')
  })

  it('creates a groupement referential for admins', async () => {
    const deps = makeDeps()
    const created = await caller(deps, adminSession).createGroupement({ name: 'Giphar' })
    expect(created).toEqual({ id: 'g1', name: 'Giphar' })
  })

  it('forbids inline groupement creation for recruiters', async () => {
    await expect(caller(makeDeps()).createGroupement({ name: 'Giphar' })).rejects.toThrow()
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makePharmacyRouter(makeDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
