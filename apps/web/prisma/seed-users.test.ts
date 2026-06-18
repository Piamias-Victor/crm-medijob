import { describe, it, expect } from 'vitest'
import { pickSeedPassword } from './seed-users'

describe('pickSeedPassword', () => {
  it('uses the env value when it is set', () => {
    expect(pickSeedPassword('from-env', 'fallback')).toBe('from-env')
  })

  it('falls back when the env value is an empty string', () => {
    expect(pickSeedPassword('', 'fallback')).toBe('fallback')
  })

  it('falls back when the env value is undefined', () => {
    expect(pickSeedPassword(undefined, 'fallback')).toBe('fallback')
  })
})
