// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { mockProvider } from '@/server/ai/mock-provider'
import { buildPresentCandidateRadiusPrompt } from '@/server/ai/present-candidate-radius-prompt'
import { runPresentCandidateRadiusEmail } from '@/server/ai/present-candidate-radius'

const input = {
  candidate: {
    firstName: 'Camille',
    lastName: 'Durand',
    jobTitleName: 'Pharmacien',
    softwareNames: ['Winpharma'],
    city: 'Lyon',
    mobilityRadiusKm: 30,
    mobilityNotes: 'Rhône-Alpes',
    notes: '5 ans en officine',
    cvSummary: 'Profil expérimenté',
  },
}

describe('runPresentCandidateRadiusEmail', () => {
  it('returns Zod-valid subject and body from provider', async () => {
    const result = await runPresentCandidateRadiusEmail(mockProvider, input)
    expect(result.subject.length).toBeGreaterThan(0)
    expect(result.body.length).toBeGreaterThan(0)
  })

  it('includes candidate context only in prompt', () => {
    const prompt = buildPresentCandidateRadiusPrompt(input)
    expect(prompt).toContain('Camille Durand')
    expect(prompt).toContain('générique')
    expect(prompt).toContain('ne cite aucune pharmacie')
  })
})
