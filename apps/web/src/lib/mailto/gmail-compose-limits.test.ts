import { describe, it, expect } from 'vitest'
import { isComposeBccTooLong, GMAIL_COMPOSE_MAX_BCC_CHARS } from '@/lib/mailto/gmail-compose-limits'

describe('isComposeBccTooLong', () => {
  it('flags oversized bcc lists', () => {
    const bcc = `${'a@example.com,'.repeat(120)}a@example.com`
    expect(bcc.length).toBeGreaterThan(GMAIL_COMPOSE_MAX_BCC_CHARS)
    expect(isComposeBccTooLong(bcc)).toBe(true)
  })
})
