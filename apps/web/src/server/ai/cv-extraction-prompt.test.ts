import { describe, it, expect } from 'vitest'
import { buildCvExtractionPrompt } from '@/server/ai/cv-extraction-prompt'

describe('buildCvExtractionPrompt', () => {
  it('asks for factual profile summary and exact job title', () => {
    const prompt = buildCvExtractionPrompt('cv.pdf')
    expect(prompt).toContain('postalCode')
    expect(prompt).toContain('profileSummary')
    expect(prompt).toContain('Préparatrice/Préparateur ≠ Pharmacien')
    expect(prompt).toContain('interdit compliments')
    expect(prompt).toContain('rawText')
  })
})
