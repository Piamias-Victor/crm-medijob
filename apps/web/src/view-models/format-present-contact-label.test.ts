import { describe, it, expect } from 'vitest'
import { formatPresentContactLabel } from '@/view-models/format-present-contact-label'

describe('formatPresentContactLabel', () => {
  it('includes person name with email', () => {
    expect(
      formatPresentContactLabel({
        firstName: 'Sophie',
        lastName: 'Moreau',
        email: 's.moreau@pharma.fr',
      }),
    ).toBe('Sophie Moreau <s.moreau@pharma.fr>')
  })

  it('falls back to email alone', () => {
    expect(formatPresentContactLabel({ email: ' alone@x.fr'.trim() })).toBe('alone@x.fr')
  })
})
