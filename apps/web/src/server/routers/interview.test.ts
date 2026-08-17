// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeInterviewRouter } from '@/server/routers/interview'
import {
  communicationSession,
  interviewCaller,
  makeInterviewDeps,
} from '@/server/routers/interview.test.fixtures'

describe('interviewRouter', () => {
  it('lists interviews for a candidate', async () => {
    const deps = makeInterviewDeps()
    const rows = await interviewCaller(deps).listByCandidate({ candidateId: 'c1' })
    expect(deps.listByCandidate).toHaveBeenCalledWith('c1')
    expect(rows[0]).toMatchObject({ id: 'i1', statusLabel: 'Brouillon', modeLabel: 'Intérim' })
  })

  it('returns one interview by id', async () => {
    const deps = makeInterviewDeps()
    const row = await interviewCaller(deps).getById({ id: 'i1' })
    expect(deps.findById).toHaveBeenCalledWith('i1')
    expect(row?.id).toBe('i1')
  })

  it('lets Communication list interviews (read)', async () => {
    const deps = makeInterviewDeps()
    const rows = await interviewCaller(deps, communicationSession).listByCandidate({
      candidateId: 'c1',
    })
    expect(rows).toHaveLength(1)
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeInterviewRouter(makeInterviewDeps()))({ session: null })
    await expect(unauth.listByCandidate({ candidateId: 'c1' })).rejects.toThrow()
  })
})
