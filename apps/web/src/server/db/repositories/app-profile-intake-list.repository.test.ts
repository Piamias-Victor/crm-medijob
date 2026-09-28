import { describe, expect, it } from 'vitest'
import { makeAppProfileRepository } from './app-profile.repository'
import { mockAppProfileDb } from './app-profile.repository.test-deps'

describe('appProfileRepository listIntakeFollowUp', () => {
  it('excludes App-validated, Ignore, negatives', async () => {
    const db = mockAppProfileDb()
    db.appProfile.findMany.mockResolvedValue([{ id: 'p1' }])
    const repo = makeAppProfileRepository(db as never)
    await repo.listIntakeFollowUp()
    expect(db.appProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          AND: [
            { status: { notIn: ['APP_VALIDATED', 'IGNORE'] } },
            {
              OR: [
                { callOutcome: null },
                { callOutcome: { notIn: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
              ],
            },
            { intakeStatus: { not: 'HORS_ZONE' } },
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
                { status: { notIn: ['APP_VALIDATED', 'IGNORE'] } },
                {
                  OR: [
                    { callOutcome: null },
                    { callOutcome: { notIn: ['PAS_INTERESSE', 'HORS_CIBLE'] } },
                  ],
                },
                { intakeStatus: { not: 'HORS_ZONE' } },
              ],
            },
            { OR: [{ referentId: 'u1' }, { referentId: null }] },
          ],
        },
      }),
    )
  })
})
