import { describe, expect, it } from 'vitest'
import {
  canArchiveInterviewProfile,
  suggestInterviewProfileKey,
} from '@/view-models/interview-template-profile-key'

describe('suggestInterviewProfileKey', () => {
  it('builds an ascii slug from the job title name', () => {
    expect(suggestInterviewProfileKey('Préparateur adjoint')).toBe('preparateur_adjoint')
  })

  it('does not suggest the reserved generique key', () => {
    expect(suggestInterviewProfileKey('Générique')).toBe('metier')
  })
})

describe('canArchiveInterviewProfile', () => {
  it('forbids archiving the generic profile', () => {
    expect(canArchiveInterviewProfile('generique')).toBe(false)
    expect(canArchiveInterviewProfile('pharmacien')).toBe(true)
  })
})
