import { describe, it, expect } from 'vitest'
import {
  toPharmacyMapPins,
  toCandidateMapPins,
  toMissionMapPins,
} from '@/view-models/entity-map-pins'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import type { RawCandidate } from '@/view-models/candidate-kanban.types'
import type { RawMission } from '@/view-models/mission-kanban.types'

describe('entity map pins', () => {
  it('maps pharmacy rows with coords and entity metadata', () => {
    const rows = [
      {
        id: 'p1',
        name: 'Pharma',
        latitude: 45.7,
        longitude: 4.8,
      } as PharmacyListRow,
    ]
    expect(toPharmacyMapPins(rows)).toEqual([
      {
        id: 'pharmacy:p1',
        entityId: 'p1',
        entityType: 'pharmacy',
        label: 'Pharma',
        latitude: 45.7,
        longitude: 4.8,
      },
    ])
  })

  it('maps candidate and mission via pharmacy coords', () => {
    const candidates = [
      {
        id: 'c1',
        firstName: 'A',
        lastName: 'B',
        latitude: 1,
        longitude: 2,
      } as RawCandidate,
    ]
    const missions = [
      {
        id: 'm1',
        title: 'CDI',
        pharmacy: { name: 'P', city: null, latitude: 3, longitude: 4 },
      } as RawMission,
    ]
    expect(toCandidateMapPins(candidates)[0]).toMatchObject({
      id: 'candidate:c1',
      entityType: 'candidate',
      label: 'A B',
    })
    expect(toMissionMapPins(missions)).toEqual([
      {
        id: 'mission:m1',
        entityId: 'm1',
        entityType: 'mission',
        label: 'CDI',
        latitude: 3,
        longitude: 4,
      },
    ])
  })
})
