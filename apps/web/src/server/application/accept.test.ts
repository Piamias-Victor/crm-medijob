import { describe, expect, it, vi } from 'vitest'
import { acceptApplication, ApplicationAcceptError } from './accept'

const pending = {
  id: 'a1',
  status: 'EN_ATTENTE',
  cvUrl: 'https://board.example/cv.pdf',
}

describe('acceptApplication', () => {
  it('creates a Candidate even if CV copy fails', async () => {
    const createCandidate = vi.fn().mockResolvedValue({ id: 'c1' })
    const markAccepted = vi.fn()
    const result = await acceptApplication(
      'a1',
      { data: { firstName: 'Léa' } },
      {
        findById: async () => pending,
        createCandidate,
        markAccepted,
        copyCvUrl: async () => {
          throw new Error('blob down')
        },
      },
    )
    expect(createCandidate).toHaveBeenCalledWith({ firstName: 'Léa' })
    expect(result.candidateId).toBe('c1')
    expect(markAccepted).toHaveBeenCalledWith('a1', 'c1')
  })

  it('attaches an existing Candidate on merge', async () => {
    const markAccepted = vi.fn()
    const result = await acceptApplication(
      'a1',
      { mergeCandidateId: 'c9' },
      {
        findById: async () => pending,
        createCandidate: vi.fn(),
        markAccepted,
      },
    )
    expect(result.candidateId).toBe('c9')
    expect(markAccepted).toHaveBeenCalledWith('a1', 'c9')
  })

  it('rejects a non-pending Application', async () => {
    await expect(
      acceptApplication(
        'a1',
        { mergeCandidateId: 'c9' },
        {
          findById: async () => ({ ...pending, status: 'REFUSEE' }),
          createCandidate: vi.fn(),
          markAccepted: vi.fn(),
        },
      ),
    ).rejects.toBeInstanceOf(ApplicationAcceptError)
  })
})
