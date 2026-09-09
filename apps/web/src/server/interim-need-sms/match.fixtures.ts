import type { NeedSmsCandidate, NeedSmsNeed } from './match.types'

export const PARIS = { latitude: 48.8566, longitude: 2.3522 }

export function needSmsCandidate(
  overrides: Partial<NeedSmsCandidate> = {},
): NeedSmsCandidate {
  return {
    id: 'c1',
    jobTitleId: 'jt-prep',
    lastSentAt: new Date('2026-09-01T07:00:00.000Z'),
    postalCode: '75001',
    ...PARIS,
    ...overrides,
  }
}

export function needSmsNeed(overrides: Partial<NeedSmsNeed> = {}): NeedSmsNeed {
  return {
    jobTitleId: 'jt-prep',
    createdAt: new Date('2026-09-08T10:00:00.000Z'),
    postalCode: '75001',
    ...PARIS,
    ...overrides,
  }
}

export const noGeoLookup = async () => null
