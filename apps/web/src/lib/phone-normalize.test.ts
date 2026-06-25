import { describe, it, expect } from 'vitest'
import { normalizePhoneDigits, phonesMatch } from '@/lib/phone-normalize'

describe('normalizePhoneDigits', () => {
  it('keeps digits only', () => {
    expect(normalizePhoneDigits('06 12 34 56 78')).toBe('0612345678')
  })
})

describe('phonesMatch', () => {
  it('matches formatted and compact phones', () => {
    expect(phonesMatch('06 12 34 56 78', '0612345678')).toBe(true)
  })
})
