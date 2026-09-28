import { describe, expect, it, vi } from 'vitest'
import { qualifyAppProfile, AppProfileError } from './qualify'

const linked = {
  id: 'p1',
  status: 'EN_ATTENTE' as const,
  candidateId: 'c1' as string | null,
  candidate: { status: 'NOUVEAU' as const },
}

describe('qualifyAppProfile', () => {
  it('sets linked candidate Qualifié', async () => {
    const setCandidateQualifie = vi.fn()
    const result = await qualifyAppProfile('p1', {
      findById: async () => linked,
      setCandidateQualifie,
    })
    expect(setCandidateQualifie).toHaveBeenCalledWith('c1')
    expect(result).toEqual({ id: 'p1', candidateId: 'c1', candidateStatus: 'QUALIFIE' })
  })

  it('qualifies App-validated rows still Nouveau', async () => {
    const setCandidateQualifie = vi.fn()
    await qualifyAppProfile('p1', {
      findById: async () => ({ ...linked, status: 'APP_VALIDATED' }),
      setCandidateQualifie,
    })
    expect(setCandidateQualifie).toHaveBeenCalledWith('c1')
  })

  it('rejects when no candidate linked', async () => {
    await expect(
      qualifyAppProfile('p1', {
        findById: async () => ({ ...linked, candidateId: null, candidate: null }),
        setCandidateQualifie: vi.fn(),
      }),
    ).rejects.toBeInstanceOf(AppProfileError)
  })
})
