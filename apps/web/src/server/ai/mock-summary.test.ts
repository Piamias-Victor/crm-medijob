// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildMockSummary } from './mock-summary'
import { buildCandidateSummaryPrompt } from './candidate-summary'

describe('buildMockSummary', () => {
  it('builds readable markdown from prompt context without leaking instructions', () => {
    const prompt = buildCandidateSummaryPrompt({
      notes: 'Expérience hospitalière',
      jobTitleName: 'Préparateur',
      softwareNames: ['Winpharma'],
    })
    const summary = buildMockSummary(prompt)
    expect(summary).toContain('## Préparateur')
    expect(summary).toContain('Expérience hospitalière')
    expect(summary).toContain('Winpharma')
    expect(summary).not.toContain('Réponds STRICTEMENT')
    expect(summary).not.toContain('Tu es un assistant')
  })
})
