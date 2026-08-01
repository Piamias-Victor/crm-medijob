import { describe, expect, it } from 'vitest'
import { collectPharmacyDuplicateMatches } from '@/server/pharmacy/detect-duplicate'

const identity = (id: string) => ({
  id,
  name: 'Pharmacie A',
  siret: '12345678901234',
  city: 'Paris',
  postalCode: '75001',
  deletedAt: null as Date | null,
})

describe('collectPharmacyDuplicateMatches', () => {
  it('returns siret match', () => {
    const matches = collectPharmacyDuplicateMatches(identity('p1'), null)
    expect(matches).toEqual([expect.objectContaining({ pharmacyId: 'p1', reason: 'siret' })])
  })

  it('returns name_city_postal match when siret misses', () => {
    const matches = collectPharmacyDuplicateMatches(null, identity('p2'))
    expect(matches).toEqual([
      expect.objectContaining({ pharmacyId: 'p2', reason: 'name_city_postal' }),
    ])
  })

  it('returns both when hits differ', () => {
    const matches = collectPharmacyDuplicateMatches(identity('p1'), identity('p2'))
    expect(matches.map((m) => m.pharmacyId).sort()).toEqual(['p1', 'p2'])
  })

  it('excludes self on edit', () => {
    expect(collectPharmacyDuplicateMatches(identity('p1'), null, 'p1')).toEqual([])
  })
})
