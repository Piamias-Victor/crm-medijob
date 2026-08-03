// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { globalSearch } from './global-search'
import { mockGlobalSearchRepos } from './global-search.test.fixtures'

describe('globalSearch', () => {
  it('returns empty groups for a blank or short term without querying repos', async () => {
    const deps = mockGlobalSearchRepos()
    expect(await globalSearch('  ', deps)).toEqual({
      pharmacies: [],
      contacts: [],
      candidates: [],
      missions: [],
    })
    expect(await globalSearch('a', deps)).toEqual({
      pharmacies: [],
      contacts: [],
      candidates: [],
      missions: [],
    })
    expect(deps.pharmacy.search).not.toHaveBeenCalled()
    expect(deps.contact.search).not.toHaveBeenCalled()
    expect(deps.candidate.search).not.toHaveBeenCalled()
    expect(deps.mission.search).not.toHaveBeenCalled()
  })

  it('maps pharmacy hits with fiche href', async () => {
    const deps = mockGlobalSearchRepos({
      pharmacy: {
        search: vi.fn().mockResolvedValue([
          { id: 'p1', name: 'Pharmacie du Centre', city: 'Lyon' },
        ]),
      },
    })
    const out = await globalSearch('centre', deps)
    expect(deps.pharmacy.search).toHaveBeenCalledWith('centre', 8)
    expect(out.pharmacies).toEqual([
      {
        id: 'p1',
        label: 'Pharmacie du Centre',
        sublabel: 'Lyon',
        href: '/pharmacies/p1',
      },
    ])
  })
})
