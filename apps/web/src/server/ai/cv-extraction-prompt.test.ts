import { describe, it, expect } from 'vitest'
import { buildCvExtractionPrompt } from '@/server/ai/cv-extraction-prompt'

describe('buildCvExtractionPrompt', () => {
  it('asks for contact fields, profile summary and rawText transcription', () => {
    const prompt = buildCvExtractionPrompt('cv.pdf')
    expect(prompt).toContain('postalCode')
    expect(prompt).toContain('profileSummary')
    expect(prompt).toContain('ne copie pas mot pour mot')
    expect(prompt).toContain('rawText')
  })
})
