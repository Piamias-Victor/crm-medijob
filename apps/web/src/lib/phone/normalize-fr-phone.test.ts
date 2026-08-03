// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { normalizeFrPhoneDigits } from '@/lib/phone/normalize-fr-phone'

describe('normalizeFrPhoneDigits', () => {
  it('converts French mobile 0… to 33…', () => {
    expect(normalizeFrPhoneDigits('06 12 34 56 78')).toBe('33612345678')
  })

  it('keeps already international digits', () => {
    expect(normalizeFrPhoneDigits('+33 6 12 34 56 78')).toBe('33612345678')
  })

  it('returns null for invalid numbers', () => {
    expect(normalizeFrPhoneDigits('123')).toBeNull()
    expect(normalizeFrPhoneDigits('')).toBeNull()
    expect(normalizeFrPhoneDigits(null)).toBeNull()
  })
})
