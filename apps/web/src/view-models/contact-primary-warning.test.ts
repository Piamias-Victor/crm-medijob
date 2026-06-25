import { describe, expect, it } from 'vitest'
import {
  formatContactPrimaryInfo,
  formatContactPrimaryReplacementWarning,
  resolveContactPrimaryMessage,
  toContactPrimaryName,
} from '@/view-models/contact-primary-warning'

describe('contact primary warning', () => {
  it('formats full name from contact fields', () => {
    expect(toContactPrimaryName({ firstName: 'Marie', lastName: 'Curie' })).toBe('Marie Curie')
  })

  it('describes existing primary without replacement copy', () => {
    expect(formatContactPrimaryInfo('Marie Curie')).toContain('Marie Curie')
    expect(formatContactPrimaryInfo('Marie Curie')).not.toContain('remplacé')
  })

  it('warns about replacement when isPrimary is checked', () => {
    expect(formatContactPrimaryReplacementWarning('Marie Curie')).toContain('remplacé')
  })

  it('picks info copy before primary toggle, replacement after', () => {
    expect(resolveContactPrimaryMessage('Marie Curie', false)).toBe(formatContactPrimaryInfo('Marie Curie'))
    expect(resolveContactPrimaryMessage('Marie Curie', true)).toBe(
      formatContactPrimaryReplacementWarning('Marie Curie'),
    )
  })
})
