import { describe, expect, it } from 'vitest'
import { buildStandaloneOfferSections } from '@/server/job-board/standalone-offer-sections'

describe('buildStandaloneOfferSections', () => {
  it('fills resume with métier, ville and contrat', () => {
    const sections = buildStandaloneOfferSections({
      jobTitleName: 'Préparateur en Pharmacie',
      city: 'Nice',
      postalCode: '06000',
      contractType: 'CDI',
      tempsPlein: true,
    })
    expect(sections.resume).toContain('Préparateur en Pharmacie')
    expect(sections.resume).toContain('Nice')
    expect(sections.resume).toContain('CDI')
    expect(sections.missions.length).toBeGreaterThan(0)
    expect(sections.profil.length).toBeGreaterThan(0)
    expect(sections.infos.join(' ')).toContain('06000')
    expect(sections.infos.join(' ')).toContain('Temps plein')
  })
})
