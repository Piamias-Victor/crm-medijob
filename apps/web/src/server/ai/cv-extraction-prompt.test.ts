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

  it('asks AI to map jobTitle onto referential labels including para variants', () => {
    const prompt = buildCvExtractionPrompt('cv.pdf', {
      jobTitles: ['Pharmacien', 'Conseiller parapharmacie', 'Préparateur', 'Autre'],
    })
    expect(prompt).toContain('Conseiller parapharmacie')
    expect(prompt).not.toMatch(/Référentiel métiers :[^\n]*Autre/)
    expect(prompt).toContain('para-pharmacie')
    expect(prompt).toContain('libellé EXACT du référentiel')
    expect(prompt).toContain('préférences de contrat')
    expect(prompt).toContain('expériences passées')
  })
})
