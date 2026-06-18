// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import {
  makeMissionCandidateRouter,
  type MissionCandidateDeps,
} from '@/server/routers/mission-candidate'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }
const input = { missionId: 'm1', candidateId: 'c1', stageId: 's2' }

function makeDeps(overrides: Partial<MissionCandidateDeps> = {}): MissionCandidateDeps {
  return {
    updateStage: vi.fn().mockResolvedValue({ ...input }),
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
