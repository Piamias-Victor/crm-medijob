import { describe, it, expect } from 'vitest'
import { pickEmailMatch, pickNamePhoneMatch } from '@/server/candidate/duplicate-identity-match'

const candidate = {
  id: 'c1',
  firstName: 'Alice',
  lastName: 'Martin',
  email: 'a@x.fr',
  phone: '0600000001',
}

describe('pickEmailMatch', () => {
  it('matches email case-insensitively', () => {
    expect(pickEmailMatch({ ...candidate, email: 'A@X.FR' }, [candidate])?.id).toBe('c1')
  })

  it('excludes self on edit', () => {
    expect(pickEmailMatch({ ...candidate, email: 'a@x.fr' }, [candidate], 'c1')).toBeNull()
  })
})

describe('pickNamePhoneMatch', () => {
  it('matches normalized phone', () => {
    const match = pickNamePhoneMatch(
      { firstName: 'Alice', lastName: 'Martin', phone: '06 00 00 00 01' },
      [candidate],
    )
    expect(match?.id).toBe('c1')
  })
})
