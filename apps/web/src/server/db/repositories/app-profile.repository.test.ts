import { describe, expect, it, vi } from 'vitest'
import { makeAppProfileRepository } from './app-profile.repository'

function mockDb() {
  return {
    appProfile: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  }
}

describe('appProfileRepository', () => {
  it('lists only EN_ATTENTE profiles', async () => {
    const db = mockDb()
    db.appProfile.findMany.mockResolvedValue([{ id: 'p1' }])
    const repo = makeAppProfileRepository(db as never)
    await repo.listPending(10)
    expect(db.appProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { status: 'EN_ATTENTE' } }),
    )
  })

  it('marks profile ignored without candidate', async () => {
    const db = mockDb()
    db.appProfile.update.mockResolvedValue({ id: 'p1', status: 'IGNORE' })
    const repo = makeAppProfileRepository(db as never)
    await repo.markStatus('p1', 'IGNORE')
    expect(db.appProfile.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { status: 'IGNORE', candidateId: undefined },
    })
  })

  it('marks App-validated without IGNORE', async () => {
    const db = mockDb()
    db.appProfile.update.mockResolvedValue({ id: 'p1', status: 'APP_VALIDATED' })
    const repo = makeAppProfileRepository(db as never)
    await repo.markStatus('p1', 'APP_VALIDATED', 'c1')
    expect(db.appProfile.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { status: 'APP_VALIDATED', candidateId: 'c1' },
    })
  })
})
