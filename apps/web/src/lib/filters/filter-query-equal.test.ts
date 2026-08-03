import { describe, it, expect } from 'vitest'
import { filterQueriesEqual, serializeFilterQuery } from '@/lib/filters/filter-query-equal'
import type { FilterConfig } from '@/lib/filters/filter-types'

const config = [
  { id: 'region', type: 'multi-select', label: 'Région', options: [] },
  { id: 'status', type: 'select', label: 'Statut', options: [] },
] as const satisfies readonly FilterConfig[]

describe('filterQueriesEqual', () => {
  it('treats cleared multi-select as equal to empty URL', () => {
    const cleared = serializeFilterQuery(config, { region: [], status: '' })
    expect(filterQueriesEqual(cleared, '')).toBe(true)
  })

  it('detects region present vs cleared', () => {
    const withRegion = serializeFilterQuery(config, { region: ['ARA'], status: '' })
    const cleared = serializeFilterQuery(config, { region: [], status: '' })
    expect(filterQueriesEqual(withRegion, cleared)).toBe(false)
  })
})
