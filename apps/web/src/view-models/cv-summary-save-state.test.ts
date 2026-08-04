import { describe, it, expect } from 'vitest'
import {
  cvSummarySaveButtonLabel,
  isCvSummarySaveDisabled,
} from '@/view-models/cv-summary-save-state'

describe('cv summary save button', () => {
  it('shows Enregistré when content matches saved (not broken grey mystery)', () => {
    expect(
      cvSummarySaveButtonLabel({ dirty: false, saving: false, hasValue: true }),
    ).toBe('Enregistré')
    expect(
      isCvSummarySaveDisabled({ dirty: false, saving: false, hasValue: true }),
    ).toBe(true)
  })

  it('enables Enregistrer when dirty', () => {
    expect(
      cvSummarySaveButtonLabel({ dirty: true, saving: false, hasValue: true }),
    ).toBe('Enregistrer')
    expect(
      isCvSummarySaveDisabled({ dirty: true, saving: false, hasValue: true }),
    ).toBe(false)
  })
})
