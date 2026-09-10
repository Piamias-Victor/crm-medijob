import { vi } from 'vitest'
import { needSmsCandidate, needSmsNeed, noGeoLookup } from './match.fixtures'
import type { NeedSmsRow } from './match.types'
import type { InterimNeedSmsDeps } from './send-due.types'

export function needSmsRow(overrides: Partial<NeedSmsRow> = {}): NeedSmsRow {
  return { ...needSmsCandidate(), phone: '06 12 34 56 78', ...overrides }
}

export function needSmsDeps(overrides: Partial<InterimNeedSmsDeps> = {}): InterimNeedSmsDeps {
  return {
    listCandidates: async () => [needSmsRow()],
    listOpenNeeds: async () => [needSmsNeed()],
    sendSms: vi.fn(),
    markSent: vi.fn(),
    lookupGeo: noGeoLookup,
    testTo: '06 99 99 99 99',
    logSend: vi.fn(),
    ...overrides,
  }
}
