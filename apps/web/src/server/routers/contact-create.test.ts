// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { contactCaller, makeContactDeps } from '@/server/routers/contact.test.fixtures'

describe('contactRouter mutations and primary lookup', () => {
  it('returns created contact id', async () => {
    const deps = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        create: vi.fn().mockResolvedValue({ id: 'new-c1' }),
      },
    })
    const result = await contactCaller(deps).create({
      pharmacyId: 'p1',
      firstName: 'Paul',
      lastName: 'Bert',
      contactRoleId: 'r1',
    })
    expect(result).toEqual({ id: 'new-c1' })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'created',
      entityType: 'CONTACT',
      entityId: 'new-c1',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })

  it('logs ActivityLog lifecycle on update', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps).update({
      id: 'c1',
      data: { pharmacyId: 'p1', firstName: 'Marie', lastName: 'Curie', contactRoleId: 'r1' },
    })
    expect(deps.logLifecycle).toHaveBeenCalledWith({
      action: 'updated',
      entityType: 'CONTACT',
      entityId: 'c1',
      user: expect.objectContaining({ id: 'u1' }),
    })
  })

  it('returns primary contact name for pharmacy', async () => {
    const deps = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        findPrimaryByPharmacy: vi.fn().mockResolvedValue({ firstName: 'Marie', lastName: 'Curie' }),
      },
    })
    await expect(contactCaller(deps).primaryByPharmacy({ pharmacyId: 'p1' })).resolves.toEqual({
      fullName: 'Marie Curie',
    })
    expect(deps.contacts.findPrimaryByPharmacy).toHaveBeenCalledWith('p1', undefined)
  })

  it('excludes current contact when resolving primary', async () => {
    const deps = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        findPrimaryByPharmacy: vi.fn().mockResolvedValue(null),
      },
    })
    await expect(
      contactCaller(deps).primaryByPharmacy({ pharmacyId: 'p1', excludeContactId: 'c1' }),
    ).resolves.toBeNull()
    expect(deps.contacts.findPrimaryByPharmacy).toHaveBeenCalledWith('p1', 'c1')
  })
})
