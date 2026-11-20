// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { filterByNearRadius, isWithinRadius } from '@/server/matching/within-radius'
import type { GeoLookup } from '@/server/matching/distance'

const LYON = { lat: 45.75, lon: 4.85 }
const PARIS = { lat: 48.85, lon: 2.35 }

const lookup: GeoLookup = async (query) => {
  if (query === 'Lyon' || query.startsWith('69')) return LYON
  if (query === 'Paris' || query.startsWith('75')) return PARIS
  return null
}

describe('isWithinRadius', () => {
  it('keeps candidate inside recruiter radius of origin', async () => {
    await expect(
      isWithinRadius({ city: 'Lyon', postalCode: '69001' }, 'Lyon', 15, lookup),
    ).resolves.toBe(true)
  })

  it('excludes candidate beyond recruiter radius', async () => {
    await expect(
      isWithinRadius({ city: 'Paris', postalCode: '75011' }, 'Lyon', 15, lookup),
    ).resolves.toBe(false)
  })

  it('excludes candidate without geo silently', async () => {
    await expect(
      isWithinRadius({ city: null, postalCode: null }, 'Lyon', 15, lookup),
    ).resolves.toBe(false)
  })
})

describe('filterByNearRadius', () => {
  it('keeps only rows inside radius of origin', async () => {
    const rows = [
      { id: 'near', city: 'Lyon', postalCode: '69001' },
      { id: 'far', city: 'Paris', postalCode: '75011' },
      { id: 'nogeo', city: null, postalCode: null },
    ]
    const kept = await filterByNearRadius(rows, 'Lyon', 15, lookup)
    expect(kept.map((row) => row.id)).toEqual(['near'])
  })
})
