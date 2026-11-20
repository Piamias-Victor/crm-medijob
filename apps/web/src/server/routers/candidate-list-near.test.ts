// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { applyNearFilter } from '@/server/routers/candidate-list-near'
import type { GeoLookup } from '@/server/matching/distance'

const LYON = { lat: 45.75, lon: 4.85 }
const PARIS = { lat: 48.85, lon: 2.35 }
const lookup: GeoLookup = async (q) =>
  q === 'Lyon' || q.startsWith('69') ? LYON : q === 'Paris' || q.startsWith('75') ? PARIS : null

const rows = [
  { id: 'a', city: 'Lyon', postalCode: '69001' },
  { id: 'b', city: 'Paris', postalCode: '75011' },
]

describe('applyNearFilter', () => {
  it('passes rows through when near unset', async () => {
    expect(await applyNearFilter(rows, {}, lookup)).toEqual(rows)
  })

  it('filters by near + radius', async () => {
    const kept = await applyNearFilter(rows, { near: 'Lyon', radiusKm: 15 }, lookup)
    expect(kept.map((r) => r.id)).toEqual(['a'])
  })
})
