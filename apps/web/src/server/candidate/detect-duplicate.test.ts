import { describe, it, expect } from 'vitest'
import { collectDuplicateMatches } from '@/server/candidate/detect-duplicate'

const identity = (id: string) => ({
  id,
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'alice@x.fr',
  phone: '0600000001',
})

describe('collectDuplicateMatches', () => {
  it('returns email match', () => {
    const matches = collectDuplicateMatches(identity('c1'), null)
    expect(matches).toEqual([
      expect.objectContaining({ candidateId: 'c1', reason: 'email' }),
    ])
  })

  it('returns name_phone match when email differs', () => {
    const matches = collectDuplicateMatches(null, identity('c2'))
    expect(matches).toEqual([
      expect.objectContaining({ candidateId: 'c2', reason: 'name_phone' }),
    ])
  })

  it('returns both candidates when email and name_phone hit different ids', () => {
    const matches = collectDuplicateMatches(identity('c1'), identity('c2'))
    expect(matches).toHaveLength(2)
    expect(matches.map((m) => m.candidateId).sort()).toEqual(['c1', 'c2'])
  })

  it('excludes self on edit', () => {
    const matches = collectDuplicateMatches(identity('c1'), null, 'c1')
    expect(matches).toEqual([])
  })
})
