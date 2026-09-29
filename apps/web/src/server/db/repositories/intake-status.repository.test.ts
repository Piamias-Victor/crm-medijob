// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { makeIntakeStatusRepository } from './intake-status.repository'

function mockDb() {
  return {
    intakeStatus: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    appProfile: {
      count: vi.fn(),
    },
    $transaction: vi.fn((ops: unknown) => Promise.all(ops as Promise<unknown>[])),
  }
}

describe('intakeStatusRepository', () => {
  it('lists active statuses ordered by position', async () => {
    const db = mockDb()
    db.intakeStatus.findMany.mockResolvedValue([])
    const repo = makeIntakeStatusRepository(db as never)
    await repo.listActive()
    expect(db.intakeStatus.findMany).toHaveBeenCalledWith({
      where: { archivedAt: null },
      orderBy: { position: 'asc' },
    })
  })

  it('archives instead of hard-delete when usage > 0', async () => {
    const db = mockDb()
    db.appProfile.count.mockResolvedValue(2)
    db.intakeStatus.update.mockResolvedValue({ id: 's1', archivedAt: new Date() })
    const repo = makeIntakeStatusRepository(db as never)
    const result = await repo.removeOrArchive('s1')
    expect(result).toEqual({ action: 'archived' })
    expect(db.intakeStatus.update).toHaveBeenCalledWith({
      where: { id: 's1' },
      data: { archivedAt: expect.any(Date) },
    })
    expect(db.intakeStatus.delete).not.toHaveBeenCalled()
  })

  it('deletes when unused', async () => {
    const db = mockDb()
    db.appProfile.count.mockResolvedValue(0)
    db.intakeStatus.delete.mockResolvedValue({ id: 's1' })
    const repo = makeIntakeStatusRepository(db as never)
    const result = await repo.removeOrArchive('s1')
    expect(result).toEqual({ action: 'deleted' })
    expect(db.intakeStatus.delete).toHaveBeenCalledWith({ where: { id: 's1' } })
  })
})
