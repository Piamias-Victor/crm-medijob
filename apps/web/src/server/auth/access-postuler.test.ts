import { describe, expect, it } from 'vitest'
import { evaluateAccess } from './access'

describe('evaluateAccess public apply', () => {
  it('allows anonymous access to /postuler', () => {
    expect(
      evaluateAccess({ loggedIn: false, role: null, pathname: '/postuler/listing-uuid' }),
    ).toBe('allow')
  })
})
