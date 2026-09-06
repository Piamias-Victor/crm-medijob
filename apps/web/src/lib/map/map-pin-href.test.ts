import { describe, it, expect } from 'vitest'
import { mapPinDetailHref } from '@/lib/map/map-pin-href'

describe('mapPinDetailHref', () => {
  it('routes pharmacy pin to pharmacy detail', () => {
    expect(mapPinDetailHref('pharmacy', 'p1', '/pharmacies')).toBe(
      '/pharmacies/p1?back=%2Fpharmacies',
    )
  })

  it('routes candidate pin to candidate detail', () => {
    expect(mapPinDetailHref('candidate', 'c1', '/candidats')).toBe(
      '/candidats/c1?back=%2Fcandidats',
    )
  })

  it('routes mission pin to mission detail', () => {
    expect(mapPinDetailHref('mission', 'm1', '/missions')).toBe(
      '/missions/m1?back=%2Fmissions',
    )
  })
})
