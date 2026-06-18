// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import {
  makeApplicationRouter,
  type ApplicationDeps,
} from '@/server/routers/application'

const session = { user: { id: 'u1', role: 'RECRUTEUR' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<ApplicationDeps> = {}): ApplicationDeps {
  return {
    listInbox: vi.fn().mockResolvedValue([{ id: 'a1', status: 'EN_ATTENTE' }]),
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
    expect(inbox).toEqual([{ id: 'a1', status: 'EN_ATTENTE' }])
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeApplicationRouter(makeDeps()))({ session: null })
    await expect(unauth.listInbox()).rejects.toThrow()
  })
})
