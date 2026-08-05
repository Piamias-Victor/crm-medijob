import { describe, it, expect } from 'vitest'
import { toLeanMapPins } from '@/view-models/lean-map-pins'

describe('toLeanMapPins', () => {
  it('prefixes ids with entity type', () => {
    expect(
      toLeanMapPins('candidate', [
        { id: 'c1', label: 'A B', latitude: 1, longitude: 2 },
      ]),
    ).toEqual([
      {
        id: 'candidate:c1',
        entityId: 'c1',
        entityType: 'candidate',
        label: 'A B',
        latitude: 1,
        longitude: 2,
      },
    ])
  })
})
