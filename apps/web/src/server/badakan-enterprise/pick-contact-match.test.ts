import { describe, expect, it } from 'vitest'
import { pickContactMatch } from './pick-contact-match'

const contacts = [
  {
    id: 'c-dom',
    email: 'd.litzler@hermes.fr',
    phone: '06 01 02 03 04',
  },
  {
    id: 'c-other',
    email: 'other@hermes.fr',
    phone: '0611111111',
  },
]

describe('pickContactMatch', () => {
  it('matches email before phone', () => {
    const hit = pickContactMatch(
      { email: 'D.Litzler@hermes.fr', phone: '0611111111' },
      contacts,
    )
    expect(hit?.id).toBe('c-dom')
    expect(hit?.reason).toBe('email')
  })

  it('matches phone when email misses', () => {
    const hit = pickContactMatch({ email: null, phone: '0601020304' }, contacts)
    expect(hit?.id).toBe('c-dom')
    expect(hit?.reason).toBe('phone')
  })

  it('returns null without a match', () => {
    expect(pickContactMatch({ email: 'x@y.fr', phone: '0699999999' }, contacts)).toBeNull()
  })
})
