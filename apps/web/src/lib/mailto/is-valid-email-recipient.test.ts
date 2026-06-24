import { describe, it, expect } from 'vitest'
import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'

describe('isValidEmailRecipient', () => {
  it('accepts a valid email address', () => {
    expect(isValidEmailRecipient(' recruteur@medijob.fr ')).toBe(true)
  })

  it('rejects an invalid email address', () => {
    expect(isValidEmailRecipient('pas-un-email')).toBe(false)
  })
})
