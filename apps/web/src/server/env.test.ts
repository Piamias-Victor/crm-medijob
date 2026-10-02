import { afterEach, describe, expect, it } from 'vitest'
import { getAuthSecret, validateServerEnv } from './env'

describe('validateServerEnv', () => {
  const env = process.env

  afterEach(() => {
    process.env = { ...env }
  })

  it('skips validation outside production', () => {
    process.env = {
      ...env,
      NODE_ENV: 'development',
      AUTH_SECRET: undefined,
      NEXTAUTH_SECRET: undefined,
    }
    expect(() => validateServerEnv()).not.toThrow()
  })

  it('throws when no auth secret in production', () => {
    process.env = {
      ...env,
      NODE_ENV: 'production',
      AUTH_SECRET: undefined,
      NEXTAUTH_SECRET: undefined,
    }
    expect(() => validateServerEnv()).toThrow(/AUTH_SECRET/)
  })

  it('accepts AUTH_SECRET with privacy env in production', () => {
    process.env = {
      ...env,
      NODE_ENV: 'production',
      AUTH_SECRET: 'test-secret',
      NEXTAUTH_SECRET: undefined,
      PUBLIC_APPLY_PRIVACY_URL: 'https://example.com/privacy',
      PUBLIC_APPLY_RETENTION_LABEL: '24 mois',
    }
    expect(() => validateServerEnv()).not.toThrow()
    expect(getAuthSecret()).toBe('test-secret')
  })
})
