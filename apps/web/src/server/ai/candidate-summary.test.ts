// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { mockProvider } from './mock-provider'
import { buildCandidateSummaryPrompt, runCandidateSummary } from './candidate-summary'

describe('candidate-summary', () => {
  it('builds prompt from notes, job title and software names', () => {
    const prompt = buildCandidateSummaryPrompt({
      notes: '5 ans en officine',
      jobTitleName: 'Pharmacien',
      softwareNames: ['Winpharma'],
    })
    expect(prompt).toContain('5 ans en officine')
    expect(prompt).toContain('Pharmacien')
    expect(prompt).toContain('Winpharma')
  })

  it('returns validated summary markdown from mock provider', async () => {
    const summary = await runCandidateSummary(mockProvider, {
      notes: 'Expérience hospitalière',
      jobTitleName: 'Préparateur',
      softwareNames: [],
    })
    expect(summary.length).toBeGreaterThan(0)
    expect(summary).toContain('Expérience hospitalière')
    expect(summary).not.toContain('Réponds STRICTEMENT')
  })
})
