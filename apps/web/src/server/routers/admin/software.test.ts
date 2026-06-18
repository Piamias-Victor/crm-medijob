// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeSoftwareRouter, type SoftwareDeps } from '@/server/routers/admin/software'

const session = { user: { id: 'u1', role: 'ADMIN' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<SoftwareDeps> = {}): SoftwareDeps {
  return {
    list: vi.fn().mockResolvedValue([{ id: 's1', name: 'Winpharma' }]),
    create: vi.fn().mockImplementation((name) => Promise.resolve({ id: 's2', name })),
    update: vi.fn().mockImplementation((id, name) => Promise.resolve({ id, name })),
    remove: vi.fn().mockResolvedValue({ id: 's1' }),
    ...overrides,
  }
}

function caller(deps: SoftwareDeps) {
  return createCallerFactory(makeSoftwareRouter(deps))({ session })
}

describe('softwareRouter', () => {
  it('returns administrable Software entries', async () => {
    const list = await caller(makeDeps()).list()
    expect(list[0].name).toBe('Winpharma')
  })

  it('creates a Software referential entry', async () => {
    const deps = makeDeps()
    const created = await caller(deps).create({ name: 'Pharmagest' })
    expect(created).toEqual({ id: 's2', name: 'Pharmagest' })
  })

  it('rejects unauthenticated callers', async () => {
    const unauth = createCallerFactory(makeSoftwareRouter(makeDeps()))({ session: null })
    await expect(unauth.list()).rejects.toThrow()
  })
})
