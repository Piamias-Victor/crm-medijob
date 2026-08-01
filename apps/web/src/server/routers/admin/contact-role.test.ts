// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import {
  makeContactRoleRouter,
  type ContactRoleDeps,
} from '@/server/routers/admin/contact-role'

const session = { user: { id: 'u1', role: 'RH_ADMIN' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<ContactRoleDeps> = {}): ContactRoleDeps {
  return {
    list: vi.fn().mockResolvedValue([{ id: 'r1', name: 'Titulaire' }]),
    create: vi.fn().mockImplementation((name) => Promise.resolve({ id: 'r2', name })),
    update: vi.fn().mockImplementation((id, name) => Promise.resolve({ id, name })),
    remove: vi.fn().mockResolvedValue({ id: 'r1' }),
    ...overrides,
  }
}

function caller(deps: ContactRoleDeps) {
  return createCallerFactory(makeContactRoleRouter(deps))({ session })
}

describe('contactRoleRouter', () => {
  it('returns administrable Contact role entries', async () => {
    const list = await caller(makeDeps()).list()
    expect(list[0].name).toBe('Titulaire')
  })

  it('creates a Contact role referential entry', async () => {
    const deps = makeDeps()
    const created = await caller(deps).create({ name: 'Comptabilité' })
    expect(created).toEqual({ id: 'r2', name: 'Comptabilité' })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeContactRoleRouter(makeDeps()))({
      session: null,
    })
    await expect(unauth.list()).rejects.toThrow()
  })
})
