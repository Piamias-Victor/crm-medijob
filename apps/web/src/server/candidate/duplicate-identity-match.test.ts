import { describe, it, expect } from 'vitest'
import {
  pickAppValidatedMatch,
  pickEmailMatch,
  pickNamePhoneMatch,
  pickPhoneMatch,
} from '@/server/candidate/duplicate-identity-match'

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

describe('pickPhoneMatch', () => {
  it('matches phone without requiring name', () => {
    expect(
      pickPhoneMatch({ firstName: 'Other', lastName: 'Name', phone: '06 00 00 00 01' }, [
        candidate,
      ])?.id,
    ).toBe('c1')
  })
})

describe('pickAppValidatedMatch', () => {
  it('prefers email over phone when both match different people', () => {
    const byPhone = { ...candidate, id: 'c-phone', email: 'other@x.fr' }
    const byEmail = { ...candidate, id: 'c-email', phone: '0699999999' }
    expect(
      pickAppValidatedMatch({ ...candidate, email: 'A@X.FR', phone: '06 00 00 00 01' }, [
        byPhone,
        byEmail,
      ])?.id,
    ).toBe('c-email')
  })
})
