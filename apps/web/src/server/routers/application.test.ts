// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import {
  makeApplicationRouter,
  type ApplicationDeps,
} from '@/server/routers/application'
import { IntakeError } from '@/server/application/intake-errors'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<ApplicationDeps> = {}): ApplicationDeps {
  return {
    listInbox: vi.fn().mockResolvedValue([
      {
        id: 'a1',
        firstName: 'Paul',
        lastName: 'Martin',
        email: 'p@x.fr',
        city: 'Lyon',
        createdAt: new Date(),
        jobTitle: null,
        jobOffer: { title: 'Offre' },
      },
    ]),
    detectDuplicate: vi.fn().mockResolvedValue(null),
    refuse: vi.fn().mockResolvedValue({ id: 'a1', status: 'REFUSEE' }),
    ...overrides,
  }
}

function caller(deps: ApplicationDeps) {
  return createCallerFactory(makeApplicationRouter(deps))({ session })
}

describe('applicationRouter', () => {
  it('returns pending Applications for the inbox', async () => {
    const deps = makeDeps()
    const inbox = await caller(deps).listInbox()
    expect(inbox[0]?.email).toBe('p@x.fr')
  })

  it('delegates duplicate detection to intake module', async () => {
    const deps = makeDeps({
      detectDuplicate: vi.fn().mockResolvedValue({ candidateId: 'c1', reason: 'email' }),
    })
    const match = await caller(deps).detectDuplicate({ id: 'a1' })
    expect(match?.candidateId).toBe('c1')
  })

  it('refuses an Application via intake module', async () => {
    const deps = makeDeps()
    const result = await caller(deps).refuse({ id: 'a1' })
    expect(result.status).toBe('REFUSEE')
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeApplicationRouter(makeDeps()))({ session: null })
    await expect(unauth.listInbox()).rejects.toThrow()
  })

  it('maps missing Application to NOT_FOUND on refuse', async () => {
    const deps = makeDeps({
      refuse: vi.fn().mockRejectedValue(new IntakeError('NOT_FOUND')),
    })
    await expect(caller(deps).refuse({ id: 'missing' })).rejects.toMatchObject({ code: 'NOT_FOUND' })
  })
})
