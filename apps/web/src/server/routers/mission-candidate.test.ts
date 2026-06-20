// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import {
  makeMissionCandidateRouter,
  type MissionCandidateDeps,
} from '@/server/routers/mission-candidate'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }
const key = { missionId: 'm1', candidateId: 'c1' }
const input = { ...key, stageId: 's2' }

function makeDeps(overrides: Partial<MissionCandidateDeps> = {}): MissionCandidateDeps {
  return {
    updateStage: vi.fn().mockResolvedValue({ ...input }),
    position: vi.fn().mockResolvedValue({ ...key, stageId: 's1' }),
    remove: vi.fn().mockResolvedValue({ ...key }),
    ...overrides,
  }
}

function caller(deps: MissionCandidateDeps) {
  return createCallerFactory(makeMissionCandidateRouter(deps))({ session })
}

describe('missionCandidateRouter', () => {
  it('returns the updated MissionCandidate from updateStage', async () => {
    const deps = makeDeps()
    const result = await caller(deps).updateStage(input)
    expect(result).toEqual(input)
  })

  it('positions a candidate on a mission', async () => {
    const deps = makeDeps()
    await caller(deps).position(key)
    expect(deps.position).toHaveBeenCalledWith(key)
  })

  it('rejects positioning a soft-deleted or missing candidate', async () => {
    const deps = makeDeps({ position: vi.fn().mockResolvedValue(null) })
    await expect(caller(deps).position(key)).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })

  it('rejects duplicate positioning on the same mission', async () => {
    const deps = makeDeps({ position: vi.fn().mockResolvedValue('duplicate') })
    await expect(caller(deps).position(key)).rejects.toMatchObject({ code: 'CONFLICT' })
  })

  it('removes a candidate from a mission', async () => {
    const deps = makeDeps()
    await caller(deps).remove(key)
    expect(deps.remove).toHaveBeenCalledWith(key)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeMissionCandidateRouter(makeDeps()))({ session: null })
    await expect(unauth.updateStage(input)).rejects.toThrow()
  })

  it('rejects input missing identifiers', async () => {
    const deps = makeDeps()
    await expect(
      caller(deps).updateStage({ missionId: '', candidateId: 'c1', stageId: 's2' }),
    ).rejects.toThrow()
  })
})
