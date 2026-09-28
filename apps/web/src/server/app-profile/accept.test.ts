import { describe, expect, it, vi } from 'vitest'
import { ignoreAppProfile, AppProfileError } from './accept'

const pending = {
  id: 'p1',
  status: 'EN_ATTENTE' as const,
  badakanId: 'bk1',
  candidateId: 'c1' as string | null,
  candidate: { status: 'NOUVEAU' as const },
}

describe('ignoreAppProfile', () => {
  it('marks pending profile IGNORE and sets candidate Inactif', async () => {
    const markStatus = vi.fn()
    const setCandidateInactive = vi.fn()
    await ignoreAppProfile('p1', {
      findById: async () => pending,
      markStatus,
      setCandidateInactive,
    })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
    expect(setCandidateInactive).toHaveBeenCalledWith('c1', 'NOUVEAU')
  })

  it('ignores App-validated rows still in Entrées', async () => {
    const markStatus = vi.fn()
    const setCandidateInactive = vi.fn()
    await ignoreAppProfile('p1', {
      findById: async () => ({
        ...pending,
        status: 'APP_VALIDATED',
      }),
      markStatus,
      setCandidateInactive,
    })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
    expect(setCandidateInactive).toHaveBeenCalledWith('c1', 'NOUVEAU')
  })

  it('rejects already ignored', async () => {
    await expect(
      ignoreAppProfile('p1', {
        findById: async () => ({ ...pending, status: 'IGNORE' }),
        markStatus: vi.fn(),
        setCandidateInactive: vi.fn(),
      }),
    ).rejects.toBeInstanceOf(AppProfileError)
  })
})
