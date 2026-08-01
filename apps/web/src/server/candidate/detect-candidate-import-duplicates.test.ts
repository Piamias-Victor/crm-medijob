import { describe, expect, it, vi } from 'vitest'
import { detectCandidateImportDuplicates } from '@/server/candidate/detect-candidate-import-duplicates'

describe('detectCandidateImportDuplicates', () => {
  it('matches on email including soft-deleted', async () => {
    const findIdentityByEmail = vi.fn().mockResolvedValue({
      id: 'c1',
      firstName: 'A',
      lastName: 'B',
      email: 'a@x.fr',
      phone: null,
    })
    const matches = await detectCandidateImportDuplicates(
      { email: 'a@x.fr' },
      { findIdentityByEmail, findIdentityByPhone: vi.fn() },
    )
    expect(matches).toEqual([expect.objectContaining({ candidateId: 'c1', reason: 'email' })])
  })

  it('matches on phone when email absent', async () => {
    const findIdentityByPhone = vi.fn().mockResolvedValue({
      id: 'c2',
      firstName: 'A',
      lastName: 'B',
      email: null,
      phone: '0600000001',
    })
    const matches = await detectCandidateImportDuplicates(
      { phone: '06 00 00 00 01' },
      { findIdentityByEmail: vi.fn(), findIdentityByPhone },
    )
    expect(matches).toEqual([expect.objectContaining({ candidateId: 'c2', reason: 'phone' })])
  })
})
