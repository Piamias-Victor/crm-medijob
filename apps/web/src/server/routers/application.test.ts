// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeApplicationRouter, type ApplicationDeps } from '@/server/routers/application'
import { IntakeError } from '@/server/application/intake-errors'
import { makeApplicationRouterDeps } from '@/server/routers/application.test.fixtures'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function caller(deps: ApplicationDeps) {
  return createCallerFactory(makeApplicationRouter(deps))({ session })
}

describe('applicationRouter', () => {
  it('returns pending Applications for the inbox', async () => {
    const inbox = await caller(makeApplicationRouterDeps()).listInbox()
    expect(inbox[0]?.email).toBe('p@x.fr')
  })

  it('returns Application detail', async () => {
    const row = await caller(makeApplicationRouterDeps()).getById({ id: 'a1' })
    expect(row.jobOffer.title).toBe('Offre')
  })

  it('delegates duplicate detection to intake module', async () => {
    const match = await caller(
      makeApplicationRouterDeps({
        detectDuplicate: vi.fn().mockResolvedValue({ candidateId: 'c1', reason: 'email' }),
      }),
    ).detectDuplicate({ id: 'a1' })
    expect(match?.candidateId).toBe('c1')
  })

  it('refuses an Application via intake module', async () => {
    const result = await caller(makeApplicationRouterDeps()).refuse({ id: 'a1' })
    expect(result.status).toBe('REFUSEE')
  })

  it('accepts by attaching an existing Candidate', async () => {
    const markAccepted = vi.fn()
    const result = await caller(makeApplicationRouterDeps({ markAccepted })).accept({
      id: 'a1',
      mergeCandidateId: 'c9',
    })
    expect(result.candidateId).toBe('c9')
    expect(markAccepted).toHaveBeenCalledWith('a1', 'c9')
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeApplicationRouter(makeApplicationRouterDeps()))({
      session: null,
    })
    await expect(unauth.listInbox()).rejects.toThrow()
  })

  it('maps missing Application to NOT_FOUND on refuse', async () => {
    await expect(
      caller(
        makeApplicationRouterDeps({
          refuse: vi.fn().mockRejectedValue(new IntakeError('NOT_FOUND')),
        }),
      ).refuse({ id: 'missing' }),
    ).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
