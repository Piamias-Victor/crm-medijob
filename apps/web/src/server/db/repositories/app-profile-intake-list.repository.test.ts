import { describe, expect, it } from 'vitest'
import { makeAppProfileRepository } from './app-profile.repository'
import { mockAppProfileDb } from './app-profile.repository.test-deps'

describe('appProfileRepository listIntakeFollowUp', () => {
  it('keeps Nouveau candidates (incl. App-validated)', async () => {
    const db = mockAppProfileDb()
    db.appProfile.findMany.mockResolvedValue([{ id: 'p1' }])
    const repo = makeAppProfileRepository(db as never)
    await repo.listIntakeFollowUp()
    expect(db.appProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { status: { not: 'IGNORE' } },
            {
              OR: [{ candidateId: null }, { candidate: { is: { status: 'NOUVEAU' } } }],
            },
          ],
        },
        orderBy: [{ relanceAt: 'asc' }, { createdAt: 'desc' }],
      }),
    )
  })

  it('filters mine ∪ unassigned when referentScope is mine', async () => {
    const db = mockAppProfileDb()
    db.appProfile.findMany.mockResolvedValue([])
    const repo = makeAppProfileRepository(db as never)
    await repo.listIntakeFollowUp({ referentScope: 'mine', currentUserId: 'u1' })
    expect(db.appProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            {
              AND: [
                { status: { not: 'IGNORE' } },
                {
                  OR: [{ candidateId: null }, { candidate: { is: { status: 'NOUVEAU' } } }],
                },
              ],
            },
            { OR: [{ referentId: 'u1' }, { referentId: null }] },
          ],
        },
      }),
    )
  })
})
