import { describe, it, expect } from 'vitest'
import { hasValidComposeRecipients } from '@/lib/mailto/has-valid-compose-recipients'

describe('hasValidComposeRecipients', () => {
  it('accepts valid bcc-only recipients', () => {
    expect(
      hasValidComposeRecipients({
        bcc: 'a@example.com,b@example.com',
      }),
    ).toBe(true)
  })

  it('rejects empty compose targets', () => {
    expect(hasValidComposeRecipients({})).toBe(false)
  })
})
