import { describe, expect, it } from 'vitest'
import { toPilotageFilters } from '@/lib/filters/pilotage-filter-map'

describe('toPilotageFilters', () => {
  it('maps Exercice and Referent select values', () => {
    expect(toPilotageFilters({ exercice: '2025', referent: 'u-alice' })).toEqual({
      exercice: '2025',
      referentId: 'u-alice',
    })
  })

  it('drops empty Referent', () => {
    expect(toPilotageFilters({ exercice: 'all', referent: '' })).toEqual({ exercice: 'all' })
  })
})
