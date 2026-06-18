// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeContactRouter, type ContactDeps } from '@/server/routers/contact'
import type { ContactListEntity } from '@/view-models/contact-list'
import type { ContactMissionRow } from '@/components/molecules/ContactMissionsTab'

const entity: ContactListEntity = {
  id: 'c1',
  firstName: 'Marie',
  lastName: 'Curie',
  role: 'TITULAIRE',
  phone: null,
  email: 'marie@example.com',
  createdAt: new Date('2026-01-15'),
  pharmacy: { name: 'Pharmacie du Centre' },
}

function makeDeps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    contacts: {
      list: vi.fn().mockResolvedValue([entity]),
      findById: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockImplementation((data) => Promise.resolve({ id: 'new', ...data })),
      update: vi.fn().mockResolvedValue({ id: 'c1' }),
      setPrimary: vi.fn().mockResolvedValue({ id: 'c1', isPrimary: true }),
      listMissions: vi.fn().mockResolvedValue([]),
      softDelete: vi.fn().mockResolvedValue({ id: 'c1' }),
    },
    pharmacies: {
      listForPicker: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Pharmacie du Centre' }]),
    },
    ...overrides,
  }
}

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function caller(deps: ContactDeps) {
  return createCallerFactory(makeContactRouter(deps))({ session })
}

describe('contactRouter', () => {
  it('returns list rows mapped to SPEC columns', async () => {
    const rows = await caller(makeDeps()).list()
    expect(rows[0]).toMatchObject({
      fullName: 'Marie Curie',
      pharmacyName: 'Pharmacie du Centre',
      role: 'TITULAIRE',
    })
  })

  it('requires pharmacyId on create', async () => {
    const deps = makeDeps()
    await expect(
      caller(deps).create({
        pharmacyId: '',
        firstName: 'Paul',
        lastName: 'Bert',
      }),
    ).rejects.toThrow()
    expect(deps.contacts.create).not.toHaveBeenCalled()
  })

  it('creates with pharmacyId', async () => {
    const deps = makeDeps()
    await caller(deps).create({
      pharmacyId: 'p1',
      firstName: 'Paul',
      lastName: 'Bert',
      role: 'TITULAIRE',
    })
    expect(deps.contacts.create).toHaveBeenCalledWith(
      expect.objectContaining({ pharmacyId: 'p1', firstName: 'Paul' }),
    )
  })

  it('delegates setPrimary to repository', async () => {
    const deps = makeDeps()
    await caller(deps).setPrimary({ id: 'c1' })
    expect(deps.contacts.setPrimary).toHaveBeenCalledWith('c1')
  })

  it('lists missions for contact', async () => {
    const deps = makeDeps({
      contacts: {
        ...makeDeps().contacts,
        listMissions: vi.fn().mockResolvedValue([
          { id: 'm1', title: 'Titulaire CDI', status: 'A_POURVOIR', pharmacy: { name: 'Pharma' } },
        ]),
      },
    })
    const missions = await caller(deps).missions({ id: 'c1' })
    expect(deps.contacts.listMissions).toHaveBeenCalledWith('c1')
    expect((missions as ContactMissionRow[])[0].title).toBe('Titulaire CDI')
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeContactRouter(makeDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
