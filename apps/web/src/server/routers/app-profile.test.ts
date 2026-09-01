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
      searchContracts: vi.fn().mockResolvedValue([]),
      getRecipient: vi.fn().mockResolvedValue(null),
      getComments: vi.fn().mockResolvedValue([]),
      getEnterprise: vi.fn().mockResolvedValue(null),
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

  it('lists Badakan comments for a CREATED profile', async () => {
    const getComments = vi.fn().mockResolvedValue([
      {
        id: 'c1',
        content: 'Répondeur : Entretien téléphonique.',
        authorName: 'Jensie Deslances',
        date: new Date('2026-03-12T14:32:00.000Z'),
      },
    ])
    const rows = await caller(
      makeDeps({
        findById: vi.fn().mockResolvedValue({
          id: 'p1',
          status: 'EN_ATTENTE',
          badakanId: 'tounkara-id',
        }),
        getBadakanClient: () => ({
          searchNewEmployees: vi.fn(),
          searchEmployees: vi.fn(),
          searchMissions: vi.fn(),
          searchContracts: vi.fn(),
          getRecipient: vi.fn(),
          getComments,
          getEnterprise: vi.fn(),
        }),
      }),
    ).listComments({ id: 'p1' })
    expect(getComments).toHaveBeenCalledWith('tounkara-id')
    expect(rows[0]).toMatchObject({
      content: 'Répondeur : Entretien téléphonique.',
      authorName: 'Jensie Deslances',
    })
  })

  it('returns empty comments when Badakan read fails', async () => {
    const rows = await caller(
      makeDeps({
        getBadakanClient: () => ({
          searchNewEmployees: vi.fn(),
          searchEmployees: vi.fn(),
          searchMissions: vi.fn(),
          searchContracts: vi.fn(),
          getRecipient: vi.fn(),
          getComments: vi.fn().mockRejectedValue(new Error('missing env')),
          getEnterprise: vi.fn(),
        }),
      }),
    ).listComments({ id: 'p1' })
    expect(rows).toEqual([])
  })
})
