// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { searchEntities } from './search'

function repos(overrides = {}) {
  return {
    candidate: { search: vi.fn().mockResolvedValue([]) },
    pharmacy: { search: vi.fn().mockResolvedValue([]) },
    mission: { search: vi.fn().mockResolvedValue([]) },
    ...overrides,
  }
}

describe('searchEntities', () => {
  it('returns [] for a blank term without querying repos', async () => {
    const deps = repos()
    expect(await searchEntities('candidate', '   ', deps)).toEqual([])
    expect(deps.candidate.search).not.toHaveBeenCalled()
  })

  it('maps candidates to a full-name label with the city as sublabel', async () => {
    const deps = repos({
      candidate: {
        search: vi.fn().mockResolvedValue([
          { id: 'c1', firstName: 'Marie', lastName: 'Curie', city: 'Lille' },
        ]),
      },
    })
    const out = await searchEntities('candidate', 'mar', deps)
    expect(deps.candidate.search).toHaveBeenCalledWith('mar')
    expect(out).toEqual([{ id: 'c1', label: 'Marie Curie', sublabel: 'Lille' }])
  })

  it('maps pharmacies by name', async () => {
    const deps = repos({
      pharmacy: {
        search: vi.fn().mockResolvedValue([{ id: 'p1', name: 'Pharmacie du Centre', city: 'Lyon' }]),
      },
    })
    expect(await searchEntities('pharmacy', 'centre', deps)).toEqual([
      { id: 'p1', label: 'Pharmacie du Centre', sublabel: 'Lyon' },
    ])
  })

  it('maps missions by title with the contract type as sublabel', async () => {
    const deps = repos({
      mission: {
        search: vi.fn().mockResolvedValue([{ id: 'm1', title: 'CDD Préparateur', contractType: 'CDD' }]),
      },
    })
    expect(await searchEntities('mission', 'prep', deps)).toEqual([
      { id: 'm1', label: 'CDD Préparateur', sublabel: 'CDD' },
    ])
  })
})
