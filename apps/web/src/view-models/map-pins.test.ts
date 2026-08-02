import { describe, it, expect } from 'vitest'
import { toMapPins } from '@/view-models/map-pins'

describe('toMapPins', () => {
  it('keeps only rows with both coords', () => {
    expect(
      toMapPins([
        { id: 'a', label: 'A', latitude: 45.7, longitude: 4.8 },
        { id: 'b', label: 'B', latitude: null, longitude: 4.8 },
        { id: 'c', label: 'C', latitude: 46, longitude: null },
      ]),
    ).toEqual([{ id: 'a', label: 'A', latitude: 45.7, longitude: 4.8 }])
  })
})
