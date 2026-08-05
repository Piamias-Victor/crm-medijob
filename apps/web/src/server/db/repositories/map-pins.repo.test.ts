import { describe, it, expect, vi } from 'vitest'
import {
  listPharmacyMapPins,
  listCandidateMapPins,
  listMissionMapPins,
} from '@/server/db/repositories/map-pins.repo'

describe('map-pins.repo', () => {
  it('maps pharmacy rows to lean pins', async () => {
    const db = {
      pharmacy: {
        findMany: vi.fn().mockResolvedValue([
          { id: 'p1', name: 'Pharma', latitude: 1, longitude: 2 },
        ]),
      },
      candidate: { findMany: vi.fn() },
      mission: { findMany: vi.fn() },
    }
    await expect(listPharmacyMapPins(db as never)).resolves.toEqual([
      { id: 'p1', label: 'Pharma', latitude: 1, longitude: 2 },
    ])
  })

  it('maps candidate and mission lean pins', async () => {
    const db = {
      pharmacy: { findMany: vi.fn() },
      candidate: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'c1',
            firstName: 'A',
            lastName: 'B',
            latitude: 3,
            longitude: 4,
          },
        ]),
      },
      mission: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'm1',
            title: 'CDI',
            pharmacy: { latitude: 5, longitude: 6 },
          },
        ]),
      },
    }
    await expect(listCandidateMapPins(db as never)).resolves.toEqual([
      { id: 'c1', label: 'A B', latitude: 3, longitude: 4 },
    ])
    await expect(listMissionMapPins(db as never)).resolves.toEqual([
      { id: 'm1', label: 'CDI', latitude: 5, longitude: 6 },
    ])
  })
})
