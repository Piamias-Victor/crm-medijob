import { describe, it, expect } from 'vitest'
import { detectDuplicateCandidate } from '@/server/application/intake'

describe('detectDuplicateCandidate', () => {
  const candidates = [
    { id: 'c1', email: 'a@x.fr', firstName: 'Alice', lastName: 'Martin', phone: '0600000001' },
  ]

  it('matches existing Candidate by email', () => {
    const match = detectDuplicateCandidate(
      { email: 'a@x.fr', firstName: 'Bob', lastName: 'X', phone: null },
      candidates,
    )
    expect(match).toEqual({ candidateId: 'c1', reason: 'email' })
  })

  it('matches by normalized name and phone', () => {
    const match = detectDuplicateCandidate(
      { email: 'new@x.fr', firstName: 'Alice', lastName: 'Martin', phone: '0600000001' },
      candidates,
    )
    expect(match?.reason).toBe('name_phone')
  })
})
