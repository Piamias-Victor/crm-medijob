import { describe, expect, it } from 'vitest'
import type { FilterConfig } from '@/lib/filters/filter-types'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { deserializeFilters, serializeFilters } from '@/lib/filters/serialize'

const demoConfig = [
  { id: 'metier', label: 'Métier', type: 'select', options: [] },
  { id: 'contrats', label: 'Contrats', type: 'multi-select', options: [] },
  { id: 'ville', label: 'Ville', type: 'text' },
  { id: 'createdAt', label: 'Créé le', type: 'date-range' },
  { id: 'ca', label: 'CA', type: 'number-range' },
  { id: 'incomplete', label: 'Incomplet', type: 'boolean' },
] as const satisfies readonly FilterConfig[]

describe('serializeFilters', () => {
  it('round-trips all six filter types via URLSearchParams', () => {
    const defaults = buildDefaultFilterValues(demoConfig)
    const values = {
      ...defaults,
      metier: 'pharmacien',
      contrats: ['cdi', 'interim'],
      ville: 'Lyon',
      createdAt: { from: '2024-01-01', to: '2024-06-30' },
      ca: { min: '1000', max: '5000' },
      incomplete: true,
    }

    const params = serializeFilters(demoConfig, values)
    expect(params.get('metier')).toBe('pharmacien')
    expect(params.getAll('contrats')).toEqual(['cdi', 'interim'])
    expect(params.get('ville')).toBe('Lyon')
    expect(params.get('createdAt.from')).toBe('2024-01-01')
    expect(params.get('createdAt.to')).toBe('2024-06-30')
    expect(params.get('ca.min')).toBe('1000')
    expect(params.get('ca.max')).toBe('5000')
    expect(params.get('incomplete')).toBe('true')

    const restored = deserializeFilters(demoConfig, params)
    expect(restored).toEqual(values)
  })

  it('omits empty values from query params', () => {
    const defaults = buildDefaultFilterValues(demoConfig)
    const params = serializeFilters(demoConfig, defaults)
    expect([...params.keys()]).toHaveLength(0)
  })
})
