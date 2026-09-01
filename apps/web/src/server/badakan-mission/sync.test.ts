import { describe, expect, it, vi } from 'vitest'
import { syncBadakanMissions } from './sync'
import type { BadakanMission } from '@/server/badakan/map-mission'

const mapped: BadakanMission = {
  badakanId: 'm-hermes',
  pharmacyName: 'Pharmacie Hermes',
  enterpriseId: 'ent-hermes',
  step: 'CANCELLED',
  periods: [{ start: '2026-08-01', end: '2026-08-03' }],
  searchApplied: [
    {
      recipientId: 'r-lucie',
      firstName: 'Lucie',
      lastName: 'Robert',
      phone: '0601020304',
    },
  ],
}

describe('syncBadakanMissions', () => {
  it('persists search results and never creates a CRM Mission', async () => {
    const upsertFromRead = vi.fn()
    const createMission = vi.fn()
    const result = await syncBadakanMissions({
      searchMissions: async () => [mapped],
      upsertFromRead,
    })
    expect(upsertFromRead).toHaveBeenCalledWith(mapped)
    expect(createMission).not.toHaveBeenCalled()
    expect(result).toEqual({ fetched: 1, upserted: 1 })
  })
})
