import { describe, expect, it } from 'vitest'
import { DEFAULT_TESTER_EMAIL, DEFAULT_TESTER_PASSWORD } from '@/server/auth/dev-tester'
import {
  DEV_AUTO_LOGIN_PATH,
  devTesterCredentials,
  isDevAutoLogin,
  shouldRedirectToDevAutoLogin,
} from '@/server/auth/dev-auto-login'

describe('isDevAutoLogin', () => {
  it('is on in development by default', () => {
    expect(isDevAutoLogin({ NODE_ENV: 'development' })).toBe(true)
  })

  it('is off in production', () => {
    expect(isDevAutoLogin({ NODE_ENV: 'production', AUTH_DEV_AUTO_LOGIN: 'true' })).toBe(false)
  })

  it('can be disabled locally', () => {
    expect(isDevAutoLogin({ NODE_ENV: 'development', AUTH_DEV_AUTO_LOGIN: 'off' })).toBe(false)
  })
})

describe('shouldRedirectToDevAutoLogin', () => {
  it('skips when the previous attempt failed', () => {
    expect(
      shouldRedirectToDevAutoLogin('dev-auto-login', { NODE_ENV: 'development' }),
    ).toBe(false)
  })

  it('redirects on a clean local login page', () => {
    expect(shouldRedirectToDevAutoLogin(undefined, { NODE_ENV: 'development' })).toBe(true)
    expect(DEV_AUTO_LOGIN_PATH).toBe('/api/auth/dev-login')
  })
})

describe('devTesterCredentials', () => {
  it('defaults to the seeded tester account', () => {
    expect(devTesterCredentials({})).toEqual({
      email: DEFAULT_TESTER_EMAIL,
      password: DEFAULT_TESTER_PASSWORD,
    })
  })

  it('uses env overrides', () => {
    expect(
      devTesterCredentials({
        SEED_TESTER_EMAIL: 'me@medijob.fr',
        SEED_TESTER_PASSWORD: 'secret-pw',
      }),
    ).toEqual({ email: 'me@medijob.fr', password: 'secret-pw' })
  })
})
