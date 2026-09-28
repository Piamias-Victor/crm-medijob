// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { appProfileCaller, makeAppProfileTestDeps } from './app-profile.test-deps'
import { intakeRow } from './app-profile-intake-update.fixtures'

describe('appProfileRouter updateIntake mirror', () => {
  it('mirrors notes to Candidate ActivityLog when linked', async () => {
    const findById = vi.fn().mockResolvedValue({ ...intakeRow, candidateId: 'c1', notes: null })
    const updateIntake = vi.fn().mockResolvedValue({
      ...intakeRow,
      candidateId: 'c1',
      notes: 'suivi',
    })
    const logActivity = vi.fn()
    await appProfileCaller(
      makeAppProfileTestDeps({ findById, updateIntake, logActivity }),
    ).updateIntake({
      id: 'p1',
      intakeStatus: 'A_RELANCER',
      callOutcome: 'MESSAGERIE',
      plannedRdvAt: null,
      notes: 'suivi',
      referentId: null,
      relanceAt: new Date('2026-03-20T12:00:00.000Z'),
    })
    expect(logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'CANDIDATE',
        entityId: 'c1',
        content: 'Entrées app — Notes : suivi',
      }),
    )
  })
})
