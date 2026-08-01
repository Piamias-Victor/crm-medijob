// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { contactCaller, makeContactDeps } from '@/server/routers/contact.test.fixtures'

describe('contactRouter.quickView', () => {
  it('returns mapped quick-view payload', async () => {
    const deps = makeContactDeps({
      contacts: {
        ...makeContactDeps().contacts,
        findQuickViewById: vi.fn().mockResolvedValue({
          id: 'c1',
          firstName: 'Marie',
          lastName: 'Curie',
          email: 'marie@example.com',
          phone: null,
          isPrimary: true,
          contactRole: { name: 'Titulaire' },
          pharmacy: { id: 'p1', name: 'Pharmacie du Centre', city: 'Lyon' },
        }),
      },
    })
    await expect(contactCaller(deps).quickView({ id: 'c1' })).resolves.toMatchObject({
      fullName: 'Marie Curie',
      roleName: 'Titulaire',
      pharmacyName: 'Pharmacie du Centre',
      city: 'Lyon',
    })
  })
})
