import { describe, it, expect } from 'vitest'
import { buildCandidateCreateDefaults } from '@/view-models/candidate-create-defaults'

describe('buildCandidateCreateDefaults', () => {
  it('checks consent by default for manual create', () => {
    const defaults = buildCandidateCreateDefaults('ref-1', 'job-1')
    expect(defaults.consentGiven).toBe(true)
    expect(defaults.status).toBe('NOUVEAU')
  })
})
