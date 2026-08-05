import { describe, it, expect } from 'vitest'
import { defaultLayerState, toggleMapLayer } from '@/lib/map/map-layer-state'

describe('map-layer-state', () => {
  it('defaults only primary layer on', () => {
    expect(defaultLayerState('candidate')).toEqual({
      pharmacy: false,
      candidate: true,
      mission: false,
    })
  })

  it('toggles layers but refuses turning off the last active one', () => {
    const onlyCandidate = defaultLayerState('candidate')
    expect(toggleMapLayer(onlyCandidate, 'candidate')).toEqual(onlyCandidate)
    const withPharmacy = toggleMapLayer(onlyCandidate, 'pharmacy')
    expect(withPharmacy.pharmacy).toBe(true)
    expect(toggleMapLayer(withPharmacy, 'candidate').candidate).toBe(false)
  })
})
