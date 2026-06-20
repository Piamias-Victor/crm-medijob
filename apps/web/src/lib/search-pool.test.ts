// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { filterSearchPool } from '@/lib/search-pool'

describe('filterSearchPool', () => {
  it('applique matcher puis slice limit', () => {
    const rows = [
      { id: 'a1', label: 'Alice' },
      { id: 'b2', label: 'Bob' },
      { id: 'a3', label: 'Anna' },
    ]
    const result = filterSearchPool(rows, 'a', (row, term) => row.label.toLowerCase().includes(term), 1)
    expect(result).toEqual([{ id: 'a1', label: 'Alice' }])
  })

  it('retourne vide si terme blank', () => {
    expect(filterSearchPool([{ id: '1' }], '  ', () => true, 5)).toEqual([])
  })
})
