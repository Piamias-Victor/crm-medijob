import { describe, expect, it, vi, afterEach } from 'vitest'
import { getRgpdRegisterUrl } from '@/server/gdpr/register-url'

describe('getRgpdRegisterUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns configured URL', () => {
    vi.stubEnv('RGPD_REGISTER_URL', 'https://notion.so/registre')
    expect(getRgpdRegisterUrl()).toBe('https://notion.so/registre')
  })

  it('returns null when unset', () => {
    vi.stubEnv('RGPD_REGISTER_URL', '')
    expect(getRgpdRegisterUrl()).toBeNull()
  })
})
