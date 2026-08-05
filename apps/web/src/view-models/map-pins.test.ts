import { describe, it, expect } from 'vitest'
import { toMapPins } from '@/view-models/map-pins'

describe('toMapPins', () => {
  it('keeps only rows with both coords and prefixes id by entity type', () => {
    expect(
      toMapPins([
        {
          entityId: 'a',
          entityType: 'pharmacy',
          label: 'A',
          latitude: 45.7,
          longitude: 4.8,
        },
        {
          entityId: 'b',
          entityType: 'candidate',
          label: 'B',
          latitude: null,
          longitude: 4.8,
        },
        {
          entityId: 'c',
          entityType: 'mission',
          label: 'C',
          latitude: 46,
          longitude: null,
        },
      ]),
    ).toEqual([
      {
        id: 'pharmacy:a',
        entityId: 'a',
        entityType: 'pharmacy',
        label: 'A',
        latitude: 45.7,
        longitude: 4.8,
      },
    ])
  })
})
