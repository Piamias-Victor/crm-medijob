import { describe, expect, it, afterEach, vi } from 'vitest'
import {
  assertPublicApplyPrivacyEnv,
  getPublicApplyPrivacyUrl,
  getPublicApplyRetentionLabel,
} from '@/server/public-apply/privacy-env'

describe('public-apply privacy env', () => {
  const env = process.env

  afterEach(() => {
    vi.unstubAllEnvs()
    process.env = env
  })

  it('falls back to placeholder when unset', () => {
    vi.stubEnv('PUBLIC_APPLY_PRIVACY_URL', '')
    vi.stubEnv('PUBLIC_APPLY_RETENTION_LABEL', '')
    delete process.env.PUBLIC_APPLY_PRIVACY_URL
    delete process.env.PUBLIC_APPLY_RETENTION_LABEL
    expect(getPublicApplyPrivacyUrl()).toBe('[À COMPLÉTER]')
    expect(getPublicApplyRetentionLabel()).toBe('[À COMPLÉTER]')
  })

  it('fails closed in production when missing', () => {
    vi.stubEnv('NODE_ENV', 'production')
    delete process.env.PUBLIC_APPLY_PRIVACY_URL
    delete process.env.PUBLIC_APPLY_RETENTION_LABEL
    expect(() => assertPublicApplyPrivacyEnv()).toThrow(/PUBLIC_APPLY_PRIVACY_URL/)
  })
})
