import { describe, expect, it, vi } from 'vitest'
import { acceptAppProfile, ignoreAppProfile, AppProfileError } from './accept'

const pending = { id: 'p1', status: 'EN_ATTENTE', badakanId: 'bk1' }

describe('ignoreAppProfile', () => {
  it('marks pending profile IGNORE', async () => {
    const markStatus = vi.fn()
    await ignoreAppProfile('p1', {
      findById: async () => pending,
      markStatus,
    })
    expect(markStatus).toHaveBeenCalledWith('p1', 'IGNORE')
  })

  it('rejects non-pending', async () => {
    await expect(
      ignoreAppProfile('p1', {
        findById: async () => ({ ...pending, status: 'IGNORE' }),
        markStatus: vi.fn(),
      }),
    ).rejects.toBeInstanceOf(AppProfileError)
  })
})

describe('acceptAppProfile', () => {
  it('imports CV then creates candidate', async () => {
    const createCandidate = vi.fn().mockResolvedValue({ id: 'c1' })
    const markStatus = vi.fn()
    const importCvUrl = vi.fn().mockResolvedValue('https://blob.example/cv.jpg')
    const result = await acceptAppProfile(
      'p1',
      { data: { firstName: 'Ada' } },
      { findById: async () => pending, createCandidate, markStatus, importCvUrl },
    )
    expect(importCvUrl).toHaveBeenCalledWith('bk1')
    expect(createCandidate).toHaveBeenCalledWith({
      firstName: 'Ada',
      cvUrl: 'https://blob.example/cv.jpg',
    })
    expect(result.candidateId).toBe('c1')
  })

  it('links existing candidate on merge', async () => {
    const markStatus = vi.fn()
    const result = await acceptAppProfile(
      'p1',
      { mergeCandidateId: 'c9' },
      {
        findById: async () => pending,
        createCandidate: vi.fn(),
        markStatus,
      },
    )
    expect(result.candidateId).toBe('c9')
    expect(markStatus).toHaveBeenCalledWith('p1', 'ACCEPTE', 'c9')
  })
})
