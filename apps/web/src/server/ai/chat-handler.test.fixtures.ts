import { vi } from 'vitest'
import type { AssistantDeps } from './chat-handler'
import type { AssistantRequest } from './provider'
import type { WeekReportCountsLoader } from '@/server/ai/week-report-assemble'

export function fakeProvider(raw: string, capture?: (req: AssistantRequest) => void) {
  return {
    complete: vi.fn(async (req: AssistantRequest) => {
      capture?.(req)
      return raw
    }),
  }
}

export function repos(overrides = {}) {
  return {
    candidate: { findById: vi.fn().mockResolvedValue(null) },
    pharmacy: { findById: vi.fn().mockResolvedValue(null) },
    mission: { findById: vi.fn().mockResolvedValue(null) },
    ...overrides,
  }
}

export function weekLoader(): WeekReportCountsLoader {
  return {
    countOpenMissions: vi.fn().mockResolvedValue(2),
    countFilledMissions: vi.fn().mockResolvedValue(1),
    countCandidatesContacted: vi.fn().mockResolvedValue(3),
    countApplicationsReceived: vi.fn().mockResolvedValue(4),
    countOffersPublished: vi.fn().mockResolvedValue(0),
    countCommercialActions: vi.fn().mockResolvedValue(1),
  }
}

export function deps(
  raw: string,
  capture?: (req: AssistantRequest) => void,
  extra: Partial<AssistantDeps> = {},
): AssistantDeps {
  return {
    provider: fakeProvider(raw, capture),
    repos: repos(),
    ...extra,
  }
}
