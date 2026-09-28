import { describe, expect, it, vi } from 'vitest'
import { mirrorIntakeToCandidate } from './mirror-intake-to-candidate'

const snap = {
  intakeStatus: 'A_APPELER' as const,
  callOutcome: null,
  plannedRdvAt: null,
  notes: null as string | null,
  referentId: null as string | null,
  relanceAt: null,
}

describe('mirrorIntakeToCandidate', () => {
  it('writes ActivityLog and syncs Referent on Candidate', async () => {
    const logActivity = vi.fn()
    const updateCandidateReferent = vi.fn()
    await mirrorIntakeToCandidate(
      { logActivity, updateCandidateReferent },
      {
        candidateId: 'c1',
        authorId: 'u1',
        previous: snap,
        next: { ...snap, notes: 'ok', referentId: 'u2' },
      },
    )
    expect(updateCandidateReferent).toHaveBeenCalledWith('c1', 'u2')
    expect(logActivity).toHaveBeenCalledWith(
      expect.objectContaining({
        entityType: 'CANDIDATE',
        entityId: 'c1',
        authorId: 'u1',
        type: 'NOTE',
        content: 'Entrées app — Notes : ok',
      }),
    )
  })
})
