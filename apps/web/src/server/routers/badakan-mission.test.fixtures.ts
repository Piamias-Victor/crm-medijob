import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanMissionRouter } from './badakan-mission'
import type { BadakanMissionDeps } from './badakan-mission.deps'

export const missionSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export const missionRow = {
  id: 'row1',
  badakanId: 'm-hermes',
  pharmacyName: 'Pharmacie Hermes',
  step: 'CANCELLED',
  periods: [{ start: '2026-08-01', end: '2026-08-03' }],
  city: 'Lyon',
  activityLabel: 'Préparateur Expert',
  jobTitleId: 'jt-prep',
  expectedRecipients: 1,
  staffedRecipients: 0,
  jobTitle: { name: 'Préparateur' },
  software: { name: 'LGPI' },
  searchApplied: [
    {
      recipientId: 'r-lucie',
      firstName: 'Lucie',
      lastName: 'Robert',
      phone: '0601020304',
    },
  ],
}

export function missionDeps(overrides: Partial<BadakanMissionDeps> = {}): BadakanMissionDeps {
  return {
    list: vi.fn().mockResolvedValue([missionRow]),
    listOpenNeeds: vi.fn().mockResolvedValue([]),
    listForSuivi: vi.fn().mockResolvedValue([]),
    findById: vi.fn().mockResolvedValue(missionRow),
    ...overrides,
  }
}

export function missionCaller(d: BadakanMissionDeps = missionDeps()) {
  return createCallerFactory(makeBadakanMissionRouter(d))({ session: missionSession })
}
