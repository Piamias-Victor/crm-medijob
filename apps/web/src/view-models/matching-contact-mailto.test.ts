// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildMatchingContactMailto } from '@/view-models/matching-contact-mailto'

describe('buildMatchingContactMailto', () => {
  it('builds grouped mailto with first to and rest bcc', () => {
    const url = buildMatchingContactMailto({
      emails: ['a@example.com', 'b@example.com'],
      subject: 'Mission Titulaire — Pharmacie Centrale',
    })
    expect(url).toMatch(/^mailto:a%40example\.com\?|^mailto:a@example\.com\?/)
    expect(url).toContain('bcc=b%40example.com')
    expect(url).toContain('subject=Mission')
  })

  it('returns null without valid emails', () => {
    expect(
      buildMatchingContactMailto({ emails: ['bad', ''], subject: 'x' }),
    ).toBeNull()
  })
})
