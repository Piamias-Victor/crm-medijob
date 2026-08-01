// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { globalSearch } from './global-search'
import { mockGlobalSearchRepos } from './global-search.test.fixtures'

describe('globalSearch groups', () => {
  it('searches four entities in parallel and maps grouped hits', async () => {
    const deps = mockGlobalSearchRepos({
      pharmacy: {
        search: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Pharma', city: null }]),
      },
      contact: {
        search: vi.fn().mockResolvedValue([
          {
            id: 'ct1',
            firstName: 'Anne',
            lastName: 'Martin',
            email: 'a@x.fr',
            pharmacy: { name: 'Pharma' },
          },
        ]),
      },
      candidate: {
        search: vi.fn().mockResolvedValue([
          { id: 'c1', firstName: 'Marie', lastName: 'Curie', city: 'Lille' },
        ]),
      },
      mission: {
        search: vi.fn().mockResolvedValue([
          { id: 'm1', title: 'CDD Préparateur', contractType: 'CDD' },
        ]),
      },
    })
    const out = await globalSearch('ma', deps)
    expect(out).toEqual({
      pharmacies: [{ id: 'p1', label: 'Pharma', href: '/pharmacies/p1' }],
      contacts: [
        {
          id: 'ct1',
          label: 'Anne Martin',
          sublabel: 'Pharma',
          href: '/contacts/ct1',
        },
      ],
      candidates: [
        {
          id: 'c1',
          label: 'Marie Curie',
          sublabel: 'Lille',
          href: '/candidats/c1',
        },
      ],
      missions: [
        {
          id: 'm1',
          label: 'CDD Préparateur',
          sublabel: 'CDD',
          href: '/missions/m1',
        },
      ],
    })
  })
})
