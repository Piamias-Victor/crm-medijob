import { describe, it, expect } from 'vitest'
import { toPositionUpdates } from '@/server/admin/reorder'

describe('toPositionUpdates', () => {
  it('maps each id to its index as position', () => {
    expect(toPositionUpdates(['c', 'a', 'b'])).toEqual([
      { id: 'c', position: 0 },
      { id: 'a', position: 1 },
      { id: 'b', position: 2 },
    ])
  })

  it('returns an empty list for no ids', () => {
    expect(toPositionUpdates([])).toEqual([])
  })
})
