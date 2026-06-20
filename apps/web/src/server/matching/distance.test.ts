// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { haversineKm } from '@/server/matching/distance'

describe('haversineKm', () => {
  it('returns ~0 km for identical coordinates', () => {
    const coords = { lat: 45.75, lon: 4.85 }
    expect(haversineKm(coords, coords)).toBeCloseTo(0, 5)
  })

  it('returns a positive distance for distinct coordinates', () => {
    const lyon = { lat: 45.75, lon: 4.85 }
    const paris = { lat: 48.85, lon: 2.35 }
    expect(haversineKm(lyon, paris)).toBeGreaterThan(300)
  })
})
