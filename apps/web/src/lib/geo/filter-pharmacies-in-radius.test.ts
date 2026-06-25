import { describe, it, expect, vi } from 'vitest'
import { filterPharmaciesByRadius } from '@/lib/geo/filter-pharmacies-in-radius'
import type { PharmacyRadiusSource } from '@/server/routers/candidate-list-in-radius'

const center = { lat: 43.11, lon: 6.13 }
const near = { lat: 43.12, lon: 6.14 }
const far = { lat: 48.85, lon: 2.35 }

const pharmacies: PharmacyRadiusSource[] = [
  {
    id: 'p-near',
    name: 'Proche',
    city: 'Hyères',
    postalCode: '83400',
    email: 'officine@example.com',
    contacts: [{ id: 'ct1', email: 'titulaire@example.com' }],
  },
  {
    id: 'p-far',
    name: 'Loin',
    city: 'Paris',
    postalCode: '75001',
    email: 'paris@example.com',
    contacts: [],
  },
]

describe('filterPharmaciesByRadius', () => {
  it('resolves postal codes in parallel and filters by distance', async () => {
    const lookupPostal = vi.fn(async (code: string) => {
      if (code === '83400') return near
      if (code === '75001') return far
      return null
    })

    const rows = await filterPharmaciesByRadius(pharmacies, center, 30, lookupPostal)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.id).toBe('p-near')
    expect(lookupPostal).toHaveBeenCalledTimes(2)
  })
})
