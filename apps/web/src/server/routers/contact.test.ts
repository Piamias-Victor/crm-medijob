// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeContactRouter } from '@/server/routers/contact'
import { contactCaller, makeContactDeps } from '@/server/routers/contact.test.fixtures'

describe('contactRouter', () => {
  it('returns list rows mapped to SPEC columns', async () => {
    const rows = await contactCaller(makeContactDeps()).list()
    expect(rows[0]).toMatchObject({
      fullName: 'Marie Curie',
      pharmacyName: 'Pharmacie du Centre',
      role: 'TITULAIRE',
    })
  })

  it('maps getById through contact detail view-model', async () => {
    const contact = await contactCaller(makeContactDeps()).getById({ id: 'c1' })
    expect(contact?.fullName).toBe('Marie Curie')
    expect(contact?.pharmacyName).toBe('Pharmacie du Centre')
  })

  it('requires pharmacyId on create', async () => {
    const deps = makeContactDeps()
    await expect(
      contactCaller(deps).create({
        pharmacyId: '',
        firstName: 'Paul',
        lastName: 'Bert',
      }),
    ).rejects.toThrow()
    expect(deps.contacts.create).not.toHaveBeenCalled()
  })

  it('creates with pharmacyId', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps).create({
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
    const deps = makeContactDeps()
    await contactCaller(deps).setPrimary({ id: 'c1' })
    expect(deps.contacts.setPrimary).toHaveBeenCalledWith('c1')
  })

  it('lists missions via read-model', async () => {
    const deps = makeContactDeps({
      listMissions: vi.fn().mockResolvedValue([
        { id: 'm1', title: 'Titulaire CDI', status: 'A_POURVOIR', pharmacy: { name: 'Pharma' } },
      ]),
    })
    const missions = await contactCaller(deps).missions({ id: 'c1' })
    expect(deps.listMissions).toHaveBeenCalledWith('c1')
    expect(missions[0]?.title).toBe('Titulaire CDI')
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeContactRouter(makeContactDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
