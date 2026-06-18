// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeMissionRouter, type MissionDeps } from '@/server/routers/mission'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }
const statusInput = { id: 'm1', status: 'EN_RECHERCHE' as const }

function makeDeps(overrides: Partial<MissionDeps> = {}): MissionDeps {
  return {
    list: vi.fn().mockResolvedValue([]),
    updateStatus: vi.fn().mockResolvedValue({ id: 'm1', status: 'EN_RECHERCHE' }),
    ...overrides,
  }
}

function caller(deps: MissionDeps) {
  return createCallerFactory(makeMissionRouter(deps))({ session })
}

describe('missionRouter', () => {
  it('returns missions from list', async () => {
    const rows = [{ id: 'm1', title: 'CDI' }]
    const deps = makeDeps({ list: vi.fn().mockResolvedValue(rows) })
    await expect(caller(deps).list()).resolves.toEqual(rows)
  })

  it('returns updated mission from updateStatus', async () => {
    const deps = makeDeps()
    const result = await caller(deps).updateStatus(statusInput)
    expect(result).toEqual({ id: 'm1', status: 'EN_RECHERCHE' })
    expect(deps.updateStatus).toHaveBeenCalledWith(statusInput)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeMissionRouter(makeDeps()))({ session: null })
    await expect(unauth.updateStatus(statusInput)).rejects.toThrow()
  })
})
