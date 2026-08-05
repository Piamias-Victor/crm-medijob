import { describe, it, expect } from 'vitest'
import { mergeVisibleMapPins } from '@/lib/map/merge-visible-map-pins'
import type { MapPin } from '@/view-models/map-pins'

const pharmacyPin: MapPin = {
  id: 'pharmacy:p1',
  entityId: 'p1',
  entityType: 'pharmacy',
  label: 'P',
  latitude: 1,
  longitude: 2,
}
const candidatePin: MapPin = {
  id: 'candidate:c1',
  entityId: 'c1',
  entityType: 'candidate',
  label: 'C',
  latitude: 3,
  longitude: 4,
}

describe('mergeVisibleMapPins', () => {
  it('merges primary filtered pins with enabled extras', () => {
    expect(
      mergeVisibleMapPins({
        layers: { pharmacy: true, candidate: true, mission: false },
        primaryType: 'pharmacy',
        primaryPins: [pharmacyPin],
        extras: { candidate: [candidatePin] },
      }),
    ).toEqual([pharmacyPin, candidatePin])
  })
})
