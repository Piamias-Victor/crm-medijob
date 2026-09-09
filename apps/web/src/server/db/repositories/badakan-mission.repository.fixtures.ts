import { vi } from 'vitest'
import { EMPTY_BADAKAN_MISSION_DETAILS } from '@/server/badakan/map-mission-details'

export const mappedMission = {
  ...EMPTY_BADAKAN_MISSION_DETAILS,
  jobTitleId: null,
  softwareId: null,
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

export function mockMissionDb() {
  return {
    badakanMission: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  }
}
