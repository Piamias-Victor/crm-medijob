// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { trackingStepFromProposals } from './badakan-tracking-step'

describe('trackingStepFromProposals', () => {
  it('returns Proposé when candidates were proposed but none validated', () => {
    expect(trackingStepFromProposals('CREATED', ['PROPOSE'])).toBe('PROPOSE')
  })

  it('returns Staffée when a proposal is validated', () => {
    expect(trackingStepFromProposals('CREATED', ['PROPOSE', 'VALIDE'])).toBe('STAFFED')
  })
})
