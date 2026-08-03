import { describe, expect, it } from 'vitest'
import { resolveConsentFields } from '@/server/gdpr/consent-fields'

describe('resolveConsentFields', () => {
  it('sets date + MANUAL when consent given on create', () => {
    const now = new Date('2026-08-03T12:00:00.000Z')
    expect(resolveConsentFields({ consentGiven: true, source: 'MANUAL' }, now)).toEqual({
      consentGivenAt: now,
      consentSource: 'MANUAL',
    })
  })

  it('leaves nulls when consent not given', () => {
    expect(resolveConsentFields({ consentGiven: false, source: 'IMPORT' })).toEqual({
      consentGivenAt: null,
      consentSource: null,
    })
  })

  it('requires SITE consent (throws if false)', () => {
    expect(() => resolveConsentFields({ consentGiven: false, source: 'SITE', required: true })).toThrow(
      /consentement/i,
    )
  })
})
