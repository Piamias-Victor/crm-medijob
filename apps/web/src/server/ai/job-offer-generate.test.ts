import { describe, it, expect } from 'vitest'
import { mockProvider } from './mock-provider'
import { buildJobOfferPrompt, runJobOfferGenerate } from './job-offer-generate'

const mission = {
  title: 'CDI Pharmacien',
  description: null,
  contractType: 'CDI',
  startDate: new Date('2026-09-01'),
  planning: 'Lun-Ven',
  salaireMin: 3500,
  salaireMax: 4200,
  salaireNotes: null,
  heuresParSemaine: 35,
  profilRecherche: 'Expérience officine',
  notes: null,
  jobTitle: { name: 'Pharmacien' },
  pharmacy: {
    name: 'Pharmacie du Parc',
    city: 'Lyon',
    notes: null,
    software: { name: 'Winpharma' },
  },
}

describe('job-offer-generate', () => {
  it('builds prompt with mission and pharmacy fields', () => {
    const prompt = buildJobOfferPrompt(mission)
    expect(prompt).toContain('Pharmacien')
    expect(prompt).toContain('Lyon')
    expect(prompt).toContain('Winpharma')
    expect(prompt).toContain('Profil recherché')
  })

  it('returns Zod-validated title and content from provider', async () => {
    const offer = await runJobOfferGenerate(mockProvider, mission)
    expect(offer.title.length).toBeGreaterThan(0)
    expect(offer.content.length).toBeGreaterThanOrEqual(100)
  })
})
