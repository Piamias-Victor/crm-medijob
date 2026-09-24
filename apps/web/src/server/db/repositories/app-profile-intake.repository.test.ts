import { describe, expect, it } from 'vitest'
import { makeAppProfileRepository } from './app-profile.repository'
import { mockAppProfileDb } from './app-profile.repository.test-deps'

describe('appProfileRepository updateIntake', () => {
  it('updates Intake status, Call outcome, planned RDV and notes', async () => {
    const db = mockAppProfileDb()
    db.appProfile.update.mockResolvedValue({ id: 'p1' })
    const repo = makeAppProfileRepository(db as never)
    const data = {
      intakeStatus: 'A_RELANCER' as const,
      callOutcome: 'MESSAGERIE' as const,
      plannedRdvAt: null,
      notes: 'rappel lundi',
      referentId: 'u1',
      relanceAt: new Date('2026-03-12T12:00:00.000Z'),
      lastCalledAt: new Date('2026-03-10T15:00:00.000Z'),
      lastCalledById: 'u1',
    }
    await repo.updateIntake('p1', data)
    expect(db.appProfile.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data,
      include: {
        jobTitle: { select: { id: true, name: true } },
        referent: { select: { id: true, name: true } },
        lastCalledBy: { select: { id: true, name: true } },
      },
    })
  })
})
