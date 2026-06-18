// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeCandidateRouter, type CandidateDeps } from '@/server/routers/candidate'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<CandidateDeps> = {}): CandidateDeps {
  return {
    listForKanban: vi.fn().mockResolvedValue([{ id: 'c1' }]),
    listStages: vi.fn().mockResolvedValue([{ id: 's1', name: 'Nouveau' }]),
    ...overrides,
  }
}

function caller(deps: CandidateDeps) {
  return createCallerFactory(makeCandidateRouter(deps))({ session })
}

describe('candidateRouter', () => {
  it('returns candidates and pipeline stages for the CVthèque', async () => {
    const deps = makeDeps()
    const result = await caller(deps).cvtheque()
    expect(result.candidates).toEqual([{ id: 'c1' }])
    expect(result.stages).toEqual([{ id: 's1', name: 'Nouveau' }])
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeCandidateRouter(makeDeps()))({ session: null })
    await expect(unauth.cvtheque()).rejects.toThrow()
  })
})
