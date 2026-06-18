// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makePipelineRouter, type PipelineDeps } from '@/server/routers/admin/pipeline'

const session = { user: { id: 'u1', role: 'ADMIN' as const }, expires: '2999-01-01' }

function makeDeps(overrides: Partial<PipelineDeps> = {}): PipelineDeps {
  return {
    list: vi.fn().mockResolvedValue([{ id: 's1', name: 'Nouveau', position: 0 }]),
    create: vi.fn().mockImplementation((name, position) =>
      Promise.resolve({ id: 's2', name, position }),
    ),
    update: vi.fn().mockImplementation((id, name) =>
      Promise.resolve({ id, name, position: 0 }),
    ),
    usageCount: vi.fn().mockResolvedValue(0),
    remove: vi.fn().mockResolvedValue({ id: 's1' }),
    reorder: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

function caller(deps: PipelineDeps) {
  return createCallerFactory(makePipelineRouter(deps))({ session })
}

describe('pipelineRouter', () => {
  it('refuses to remove a PipelineStage still in use', async () => {
    const deps = makeDeps({ usageCount: vi.fn().mockResolvedValue(2) })
    await expect(caller(deps).remove({ id: 's1' })).rejects.toMatchObject({
      code: 'CONFLICT',
    })
  })

  it('appends a new PipelineStage at the end of the list', async () => {
    const deps = makeDeps()
    const created = await caller(deps).create({ name: 'Entretien' })
    expect(created).toEqual({ id: 's2', name: 'Entretien', position: 1 })
  })
})
