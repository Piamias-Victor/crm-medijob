// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeContactRouter } from '@/server/routers/contact'
import { contactCaller, makeContactDeps, directionSession } from '@/server/routers/contact.test.fixtures'
import {
  PRIMARY_CONTACT_SOFT_DELETE_MESSAGE,
  PrimaryContactSoftDeleteError,
} from '@/server/db/repositories/contact-soft-delete'

describe('contactRouter', () => {
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
        contactRoleId: 'r1',
      }),
    ).rejects.toThrow()
    expect(deps.contacts.create).not.toHaveBeenCalled()
  })

  it('creates with pharmacyId and contactRoleId', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps).create({
      pharmacyId: 'p1',
      firstName: 'Paul',
      lastName: 'Bert',
      contactRoleId: 'r1',
    })
    expect(deps.contacts.create).toHaveBeenCalledWith(
      expect.objectContaining({ pharmacyId: 'p1', firstName: 'Paul', contactRoleId: 'r1' }),
    )
  })

  it('delegates setPrimary to repository', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps).setPrimary({ id: 'c1' })
    expect(deps.contacts.setPrimary).toHaveBeenCalledWith('c1')
  })

  it('soft-deletes for Direction and maps primary guard', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps, directionSession).softDelete({ id: 'c1' })
    expect(deps.contacts.softDelete).toHaveBeenCalledWith('c1')

    const blocked = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        softDelete: vi.fn().mockRejectedValue(new PrimaryContactSoftDeleteError()),
      },
    })
    await expect(contactCaller(blocked, directionSession).softDelete({ id: 'c1' })).rejects.toMatchObject({
      code: 'PRECONDITION_FAILED',
      message: PRIMARY_CONTACT_SOFT_DELETE_MESSAGE,
    })
  })

  it('forbids soft delete for Recruteur', async () => {
    await expect(contactCaller(makeContactDeps()).softDelete({ id: 'c1' })).rejects.toMatchObject({
      code: 'FORBIDDEN',
    })
  })

  it('batch listByPharmacyIds groups contacts by pharmacy', async () => {
    const base = makeContactDeps()
    const deps = makeContactDeps({
      contacts: {
        ...base.contacts,
        listByPharmacyIds: vi.fn().mockResolvedValue([
          { id: 'c1', firstName: 'Marie', lastName: 'Curie', pharmacyId: 'p1' },
        ]),
      },
    })
    const grouped = await contactCaller(deps).listByPharmacyIds({ pharmacyIds: ['p1'] })
    expect(deps.contacts.listByPharmacyIds).toHaveBeenCalledWith(['p1'])
    expect(grouped.p1).toEqual([{ id: 'c1', label: 'Marie Curie' }])
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

  it('exposes pharmacies and Contact roles under referentials', async () => {
    const deps = makeContactDeps({
      pharmacies: {
        listForPicker: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Pharmacie du Centre' }]),
      },
      contactRoles: {
        list: vi.fn().mockResolvedValue([{ id: 'r1', name: 'Titulaire' }]),
      },
    })
    const caller = contactCaller(deps)
    await expect(caller.referentials()).resolves.toEqual({
      pharmacies: [{ id: 'p1', name: 'Pharmacie du Centre' }],
      contactRoles: [{ id: 'r1', name: 'Titulaire' }],
    })
    await expect(caller.pharmacyOptions()).resolves.toEqual([{ id: 'p1', name: 'Pharmacie du Centre' }])
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeContactRouter(makeContactDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
