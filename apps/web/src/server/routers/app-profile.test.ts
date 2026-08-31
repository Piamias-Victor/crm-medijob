// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeAppProfileRouter } from './app-profile'
import type { AppProfileDeps } from './app-profile.deps'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<AppProfileDeps> = {}): AppProfileDeps {
  return {
    listPending: vi.fn().mockResolvedValue([]),
    countPending: vi.fn().mockResolvedValue(0),
    findById: vi.fn().mockResolvedValue({ id: 'p1', status: 'EN_ATTENTE', badakanId: 'bk1' }),
    findByBadakanIds: vi.fn().mockResolvedValue([]),
    upsertPending: vi.fn(),
    markStatus: vi.fn(),
    createProfile: vi.fn().mockResolvedValue({ id: 'c1' }),
    findJobTitleIdByName: vi.fn().mockResolvedValue(null),
    getBadakanClient: () => ({
      searchNewEmployees: vi.fn().mockResolvedValue([]),
      searchEmployees: vi.fn().mockResolvedValue([]),
      searchMissions: vi.fn().mockResolvedValue([]),
      getRecipient: vi.fn().mockResolvedValue(null),
    }),
    importCvUrl: vi.fn().mockResolvedValue(null),
    ...overrides,
  }
}

function caller(deps: AppProfileDeps) {
  return createCallerFactory(makeAppProfileRouter(deps))({ session })
}

describe('appProfileRouter', () => {
  it('ignores a pending profile', async () => {
    const markStatus = vi.fn()
    await caller(makeDeps({ markStatus })).ignore({ id: 'p1' })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
  })
})
