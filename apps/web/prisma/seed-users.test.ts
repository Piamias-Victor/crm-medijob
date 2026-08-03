import { describe, it, expect, afterEach } from 'vitest'
import { pickSeedPassword, resolveSeedPassword } from './seed-users'

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

describe('resolveSeedPassword', () => {
  const keys = ['SEED_RH_ADMIN_PASSWORD', 'SEED_ADMIN_PASSWORD'] as const

  afterEach(() => {
    delete process.env.SEED_RH_ADMIN_PASSWORD
    delete process.env.SEED_ADMIN_PASSWORD
  })

  it('prefers the first env key', () => {
    process.env.SEED_RH_ADMIN_PASSWORD = 'new'
    process.env.SEED_ADMIN_PASSWORD = 'legacy'
    expect(resolveSeedPassword(keys, 'fallback')).toBe('new')
  })

  it('falls back to legacy env key', () => {
    process.env.SEED_ADMIN_PASSWORD = 'legacy'
    expect(resolveSeedPassword(keys, 'fallback')).toBe('legacy')
  })

  it('falls back to default password', () => {
    expect(resolveSeedPassword(keys, 'fallback')).toBe('fallback')
  })
})
