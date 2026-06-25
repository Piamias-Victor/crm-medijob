import { describe, it, expect } from 'vitest'
import { truncateComposeBody } from '@/lib/mailto/truncate-compose-body'
import { GMAIL_COMPOSE_MAX_BODY_CHARS } from '@/lib/mailto/gmail-compose-limits'

describe('truncateComposeBody', () => {
  it('returns the body unchanged when within the limit', () => {
    expect(truncateComposeBody('Court', 10)).toBe('Court')
  })

  it('truncates long bodies for Gmail compose URLs', () => {
    const longBody = 'a'.repeat(GMAIL_COMPOSE_MAX_BODY_CHARS + 20)
    const truncated = truncateComposeBody(longBody, GMAIL_COMPOSE_MAX_BODY_CHARS)
    expect(truncated.length).toBeLessThanOrEqual(GMAIL_COMPOSE_MAX_BODY_CHARS)
    expect(truncated.endsWith('…')).toBe(true)
  })
})
