import { describe, expect, it, vi } from 'vitest'
import { acceptAppProfile, ignoreAppProfile, AppProfileError } from './accept'

describe('ignoreAppProfile', () => {
  it('marks pending profile IGNORE', async () => {
    const markStatus = vi.fn()
    await ignoreAppProfile('p1', {
      findById: async () => ({ id: 'p1', status: 'EN_ATTENTE' }),
      markStatus,
    })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
  })

  it('rejects non-pending', async () => {
    await expect(
      ignoreAppProfile('p1', {
        findById: async () => ({ id: 'p1', status: 'IGNORE' }),
        markStatus: vi.fn(),
      }),
    ).rejects.toBeInstanceOf(AppProfileError)
  })
})

describe('acceptAppProfile', () => {
  it('creates candidate then marks ACCEPTE', async () => {
    const createCandidate = vi.fn().mockResolvedValue({ id: 'c1' })
    const markStatus = vi.fn()
    const result = await acceptAppProfile(
      'p1',
      { data: { firstName: 'Ada' } },
      {
        findById: async () => ({ id: 'p1', status: 'EN_ATTENTE' }),
        createCandidate,
        markStatus,
      },
    )
    expect(result.candidateId).toBe('c1')
    expect(markStatus).toHaveBeenCalledWith('p1', 'ACCEPTE', 'c1')
  })

  it('links existing candidate on merge', async () => {
    const markStatus = vi.fn()
    const result = await acceptAppProfile(
      'p1',
      { mergeCandidateId: 'c9' },
      {
        findById: async () => ({ id: 'p1', status: 'EN_ATTENTE' }),
        createCandidate: vi.fn(),
        markStatus,
      },
    )
    expect(result.candidateId).toBe('c9')
    expect(markStatus).toHaveBeenCalledWith('p1', 'ACCEPTE', 'c9')
  })
})
