import { describe, it, expect } from 'vitest'
import { resolvePharmacyOutreachEmail } from '@/lib/pharmacy/resolve-outreach-email'

describe('resolvePharmacyOutreachEmail', () => {
  it('uses primary contact email when valid', () => {
    expect(
      resolvePharmacyOutreachEmail({
        pharmacyEmail: 'officine@example.com',
        primaryContactEmail: 'titulaire@example.com',
      }),
    ).toBe('titulaire@example.com')
  })

  it('falls back to pharmacy email when contact email missing', () => {
    expect(
      resolvePharmacyOutreachEmail({
        pharmacyEmail: 'officine@example.com',
        primaryContactEmail: null,
      }),
    ).toBe('officine@example.com')
  })

  it('returns null when no valid email exists', () => {
    expect(
      resolvePharmacyOutreachEmail({
        pharmacyEmail: 'not-an-email',
        primaryContactEmail: '',
      }),
    ).toBeNull()
  })
})
