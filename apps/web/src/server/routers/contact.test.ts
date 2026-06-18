// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeContactRouter } from '@/server/routers/contact'
import type { ContactMissionRow } from '@/components/molecules/ContactMissionsTab'
import {
  contactCaller,
  makeContactDeps,
} from '@/server/routers/contact.test.fixtures'

describe('contactRouter', () => {
  it('returns list rows mapped to SPEC columns', async () => {
    const rows = await contactCaller(makeContactDeps()).list()
    expect(rows[0]).toMatchObject({
      fullName: 'Marie Curie',
      pharmacyName: 'Pharmacie du Centre',
      role: 'TITULAIRE',
    })
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

  it('lists missions for contact', async () => {
    const deps = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        listMissions: vi.fn().mockResolvedValue([
          { id: 'm1', title: 'Titulaire CDI', status: 'A_POURVOIR', pharmacy: { name: 'Pharma' } },
        ]),
      },
    })
    const missions = await contactCaller(deps).missions({ id: 'c1' })
    expect(deps.contacts.listMissions).toHaveBeenCalledWith('c1')
    expect((missions as ContactMissionRow[])[0].title).toBe('Titulaire CDI')
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeContactRouter(makeContactDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
