import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeAppProfileRouter } from './app-profile'
import type { AppProfileDeps } from './app-profile.deps'
import { stubBadakanClient } from './app-profile.test-client'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

export function makeAppProfileTestDeps(
  overrides: Partial<AppProfileDeps> = {},
): AppProfileDeps {
  return {
    listPending: vi.fn().mockResolvedValue([]),
    listIntakeFollowUp: vi.fn().mockResolvedValue([]),
    countPending: vi.fn().mockResolvedValue(0),
    findById: vi.fn().mockResolvedValue({ id: 'p1', status: 'EN_ATTENTE', badakanId: 'bk1' }),
    findByBadakanIds: vi.fn().mockResolvedValue([]),
    upsertPending: vi.fn(),
    updateIntake: vi.fn(),
    markStatus: vi.fn(),
    findJobTitleIdByName: vi.fn().mockResolvedValue(null),
    getBadakanClient: () => stubBadakanClient(),
    runTestProcess: vi.fn().mockResolvedValue({ ok: false, reason: 'test_phone_missing' }),
    sendCalendarSmsTest: vi.fn().mockResolvedValue({ ok: false, reason: 'test_phone_missing' }),
    ...overrides,
  }
}

export function appProfileCaller(deps: AppProfileDeps) {
  return createCallerFactory(makeAppProfileRouter(deps))({ session })
}
