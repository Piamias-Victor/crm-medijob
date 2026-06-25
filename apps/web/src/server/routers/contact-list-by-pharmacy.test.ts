// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { contactCaller, makeContactDeps } from '@/server/routers/contact.test.fixtures'

describe('contactRouter.listByPharmacy', () => {
  it('lists contacts by pharmacy with email and primary flag', async () => {
    const base = makeContactDeps()
    const deps = makeContactDeps({
      contacts: {
        ...base.contacts,
        listByPharmacy: vi.fn().mockResolvedValue([
          {
            id: 'c1',
            firstName: 'Marie',
            lastName: 'Curie',
            email: 'marie@example.com',
            isPrimary: true,
          },
          { id: 'c2', firstName: 'Paul', lastName: 'Bert', email: null, isPrimary: false },
        ]),
      },
    })
    const rows = await contactCaller(deps).listByPharmacy({ pharmacyId: 'p1' })
    expect(rows).toEqual([
      {
        id: 'c1',
        label: 'Marie Curie',
        email: 'marie@example.com',
        isPrimary: true,
      },
    ])
  })
})
