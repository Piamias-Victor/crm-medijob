// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildSmsUrl } from '@/lib/phone/build-sms-url'

describe('buildSmsUrl', () => {
  it('builds sms deep link for valid French phone', () => {
    expect(buildSmsUrl('06 12 34 56 78')).toBe('sms:+33612345678')
  })

  it('returns null when phone invalid', () => {
    expect(buildSmsUrl('abc')).toBeNull()
  })
})
