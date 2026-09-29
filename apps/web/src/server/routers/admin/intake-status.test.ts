// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import {
  makeIntakeStatusAdminRouter,
  type IntakeStatusAdminDeps,
} from '@/server/routers/admin/intake-status'

const session = { user: { id: 'u1', role: 'RH_ADMIN' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<IntakeStatusAdminDeps> = {}): IntakeStatusAdminDeps {
  return {
    list: vi.fn().mockResolvedValue([
      { id: 'A_APPELER', name: 'À appeler', color: '#FEF3C7', position: 0, archivedAt: null },
    ]),
    create: vi.fn().mockImplementation((input, position) =>
      Promise.resolve({
        id: 's2',
        name: input.name,
        color: input.color,
        position,
        archivedAt: null,
      }),
    ),
    update: vi.fn().mockImplementation((id, input) =>
      Promise.resolve({
        id,
        name: input.name,
        color: input.color,
        position: 0,
        archivedAt: null,
      }),
    ),
    removeOrArchive: vi.fn().mockResolvedValue({ action: 'deleted' }),
    reorder: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function caller(deps: IntakeStatusAdminDeps) {
  return createCallerFactory(makeIntakeStatusAdminRouter(deps))({ session })
}

describe('intakeStatusAdminRouter', () => {
  it('creates a status with color at end of list', async () => {
    const deps = makeDeps()
    const created = await caller(deps).create({ name: 'Nouveau', color: '#abc' })
    expect(created).toMatchObject({
      name: 'Nouveau',
      color: '#AABBCC',
      position: 1,
    })
  })

  it('archives when removeOrArchive reports archived', async () => {
    const deps = makeDeps({
      removeOrArchive: vi.fn().mockResolvedValue({ action: 'archived' }),
    })
    await expect(caller(deps).remove({ id: 's1' })).resolves.toEqual({ action: 'archived' })
  })
})
