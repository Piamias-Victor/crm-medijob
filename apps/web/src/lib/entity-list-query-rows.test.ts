// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { resolveEntityListRows } from '@/lib/entity-list-query-rows'

describe('resolveEntityListRows', () => {
  const initial = [{ id: '1' }, { id: '2' }]
  const filtered = [{ id: '1' }]
  const serverFilters = { statuses: ['ACTIF'] as const }
  const otherFilters = { statuses: ['PROSPECT'] as const }

  it('retourne les données query quand disponibles', () => {
    expect(resolveEntityListRows(filtered, initial, otherFilters, serverFilters)).toEqual(filtered)
  })

  it('retombe sur initialRows seulement si filtres = SSR', () => {
    expect(resolveEntityListRows(undefined, initial, serverFilters, serverFilters)).toEqual(initial)
  })

  it('ne retombe pas sur initialRows quand filtres changent', () => {
    expect(resolveEntityListRows(undefined, initial, otherFilters, serverFilters)).toEqual([])
  })
})
