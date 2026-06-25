// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { mockProvider } from '@/server/ai/mock-provider'
import { buildPresentCandidatePrompt } from '@/server/ai/present-candidate-prompt'
import { runPresentCandidateEmail } from '@/server/ai/present-candidate'

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
  pharmacy: {
    name: 'Pharmacie du Centre',
    city: 'Lyon',
    type: 'INDEPENDANTE',
    status: 'CLIENT',
    notes: 'Client fidèle',
  },
}

describe('runPresentCandidateEmail', () => {
  it('returns Zod-valid subject and body from provider', async () => {
    const result = await runPresentCandidateEmail(mockProvider, input)
    expect(result.subject.length).toBeGreaterThan(0)
    expect(result.body.length).toBeGreaterThan(0)
  })

  it('includes candidate and pharmacy context in prompt', () => {
    const prompt = buildPresentCandidatePrompt(input)
    expect(prompt).toContain('Camille Durand')
    expect(prompt).toContain('Pharmacie du Centre')
    expect(prompt).toContain('Winpharma')
  })
})
