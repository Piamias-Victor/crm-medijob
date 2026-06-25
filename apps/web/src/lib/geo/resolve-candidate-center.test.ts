import { describe, it, expect, vi } from 'vitest'
import { resolveCandidateCenterCoords } from '@/lib/geo/resolve-candidate-center'
import type { Coords } from '@/server/matching/distance'

const lyon: Coords = { lat: 45.75, lon: 4.85 }

describe('resolveCandidateCenterCoords', () => {
  it('prefers postal code lookup', async () => {
    const lookupPostal = vi.fn().mockResolvedValue(lyon)
    const lookupQuery = vi.fn().mockResolvedValue(null)

    const result = await resolveCandidateCenterCoords(
      { postalCode: '69001', address: '12 rue Test', city: 'Lyon' },
      lookupPostal,
      lookupQuery,
    )

    expect(result).toEqual(lyon)
    expect(lookupPostal).toHaveBeenCalledWith('69001')
    expect(lookupQuery).not.toHaveBeenCalled()
  })

  it('falls back to city when postal code is invalid', async () => {
    const lookupPostal = vi.fn().mockResolvedValue(null)
    const lookupQuery = vi.fn().mockResolvedValue(lyon)

    const result = await resolveCandidateCenterCoords(
      { postalCode: '40', address: null, city: 'Saint-Paul-lès-Dax' },
      lookupPostal,
      lookupQuery,
    )

    expect(result).toEqual(lyon)
    expect(lookupPostal).not.toHaveBeenCalled()
    expect(lookupQuery).toHaveBeenCalledWith('Saint-Paul-lès-Dax')
  })
})
