import { describe, it, expect } from 'vitest'
import { syncRadiusPharmacySelection } from '@/lib/present-candidate-radius/sync-radius-pharmacy-selection'

describe('syncRadiusPharmacySelection', () => {
  it('keeps prior selection when pharmacies still exist after radius change', () => {
    expect(syncRadiusPharmacySelection(['p1', 'p2'], ['p1', 'p2', 'p3'])).toEqual(['p1', 'p2'])
  })

  it('selects all pharmacies when prior selection no longer overlaps', () => {
    expect(syncRadiusPharmacySelection(['p9'], ['p1', 'p2'])).toEqual(['p1', 'p2'])
  })
})
