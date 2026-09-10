import { describe, expect, it } from 'vitest'
import { resolvePharmacyApplyEmails } from './resolve-apply-emails'

describe('resolvePharmacyApplyEmails', () => {
  it('keeps pharmacy and primary contact emails', () => {
    expect(
      resolvePharmacyApplyEmails({
        pharmacyEmail: 'officine@example.com',
        primaryContactEmail: 'marie@example.com',
      }),
    ).toEqual(['officine@example.com', 'marie@example.com'])
  })

  it('sends once when pharmacy and contact share the same email', () => {
    expect(
      resolvePharmacyApplyEmails({
        pharmacyEmail: 'marie@example.com',
        primaryContactEmail: 'marie@example.com',
      }),
    ).toEqual(['marie@example.com'])
  })

  it('drops invalid addresses', () => {
    expect(
      resolvePharmacyApplyEmails({
        pharmacyEmail: 'not-an-email',
        primaryContactEmail: 'marie@example.com',
      }),
    ).toEqual(['marie@example.com'])
  })
})
