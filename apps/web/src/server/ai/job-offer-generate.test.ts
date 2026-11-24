import { describe, it, expect, vi } from 'vitest'
import { mockProvider } from './mock-provider'
import { buildJobOfferPrompt, runJobOfferGenerate } from './job-offer-generate'
import type { AssistantProvider } from './provider'

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
  it('builds prompt with mission fields without pharmacy name', () => {
    const prompt = buildJobOfferPrompt(mission)
    expect(prompt).toContain('Pharmacien')
    expect(prompt).toContain('Lyon')
    expect(prompt).toContain('Winpharma')
    expect(prompt).not.toContain('Pharmacie du Parc')
  })

  it('excludes mission internal notes from the offer prompt', () => {
    const prompt = buildJobOfferPrompt({
      ...mission,
      notes: 'Titulaire Mme X — 06 12 34 56 78 — infos Teo confidentielles',
    })
    expect(prompt).not.toContain('06 12 34 56 78')
    expect(prompt).not.toContain('Titulaire Mme X')
    expect(prompt).not.toContain('confidentielles')
  })

  it('keeps public mission fields in the offer prompt when notes are set', () => {
    const prompt = buildJobOfferPrompt({
      ...mission,
      notes: 'Titulaire Mme X — 06 12 34 56 78',
      profilRecherche: 'BP préparateur, polyvalent',
    })
    expect(prompt).toContain('BP préparateur, polyvalent')
    expect(prompt).toContain('Pharmacien')
    expect(prompt).toContain('Lyon')
    expect(prompt).toContain('Winpharma')
  })

  it('instructs the model to omit confidential and contact details', () => {
    const prompt = buildJobOfferPrompt(mission)
    expect(prompt).toMatch(/confidentiel|interne/i)
    expect(prompt).toMatch(/t[ée]l[ée]phone|coordonn[ée]es/i)
  })

  it('returns formatted title and sectioned HTML content', async () => {
    const offer = await runJobOfferGenerate(mockProvider, mission)
    expect(offer.title).toBe('Pharmacien')
    expect(offer.content).toContain('RÉSUMÉ DU POSTE')
    expect(offer.content).toContain('MISSIONS DU POSTE')
    expect(offer.content).toContain('PROFIL RECHERCHÉ')
    expect(offer.content).toContain('INFORMATIONS COMPLÉMENTAIRES')
  })

  it('retries once when first AI JSON is invalid then succeeds', async () => {
    const complete = vi
      .fn()
      .mockResolvedValueOnce('not-json')
      .mockResolvedValueOnce(
        JSON.stringify({
          resume: 'Ok',
          missions: ['A'],
          profil: ['B'],
          infos: ['C'],
        }),
      )
    const provider: AssistantProvider = { complete }
    const offer = await runJobOfferGenerate(provider, mission)
    expect(complete).toHaveBeenCalledTimes(2)
    expect(offer.content).toContain('RÉSUMÉ DU POSTE')
  })

  it('throws after a second invalid AI response', async () => {
    const provider: AssistantProvider = {
      complete: vi.fn().mockResolvedValue('not-json'),
    }
    await expect(runJobOfferGenerate(provider, mission)).rejects.toThrow()
  })
})
