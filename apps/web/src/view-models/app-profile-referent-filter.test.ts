import { describe, expect, it } from 'vitest'
import { matchesMineOrUnassigned } from './app-profile-referent-filter'

describe('matchesMineOrUnassigned', () => {
  it('keeps own and unassigned rows', () => {
    expect(matchesMineOrUnassigned('u1', 'u1')).toBe(true)
    expect(matchesMineOrUnassigned(null, 'u1')).toBe(true)
    expect(matchesMineOrUnassigned('u2', 'u1')).toBe(false)
  })
})
