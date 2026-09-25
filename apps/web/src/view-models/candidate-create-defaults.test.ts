import { describe, it, expect } from 'vitest'
import {
  buildCandidateCreateDefaults,
  pickDefaultJobTitleId,
} from '@/view-models/candidate-create-defaults'

describe('buildCandidateCreateDefaults', () => {
  it('checks consent by default for manual create', () => {
    const defaults = buildCandidateCreateDefaults('ref-1', 'job-1')
    expect(defaults.consentGiven).toBe(true)
    expect(defaults.status).toBe('NOUVEAU')
  })
})

describe('pickDefaultJobTitleId', () => {
  it('skips Autre when other métiers exist', () => {
    expect(
      pickDefaultJobTitleId([
        { id: 'jt-autre', name: 'Autre' },
        { id: 'jt-para', name: 'Conseiller parapharmacie' },
      ]),
    ).toBe('jt-para')
  })
})
