// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  emptyAnonymizedDossier,
  formatAnonymizedDossierExport,
  nonEmptyAnonymizedSections,
  parseAnonymizedDossier,
  serializeAnonymizedDossier,
} from '@/view-models/anonymized-dossier'
import { anonymizedDossierSchema } from '@/view-models/anonymized-dossier.schema'

describe('anonymized dossier schema', () => {
  it('accepts six plain-string sections with max lengths', () => {
    const dossier = {
      ...emptyAnonymizedDossier(),
      accroche: 'Profil officine expérimenté',
      metierExperience: '5 ans en officine de quartier',
    }
    expect(anonymizedDossierSchema.parse(dossier)).toEqual(dossier)
  })

  it('rejects unknown keys and oversized accroche', () => {
    expect(() =>
      anonymizedDossierSchema.parse({
        ...emptyAnonymizedDossier(),
        accroche: 'x'.repeat(501),
      }),
    ).toThrow()
  })
})

describe('parseAnonymizedDossier', () => {
  it('parses JSON structured dossier', () => {
    const dossier = {
      ...emptyAnonymizedDossier(),
      accroche: 'Accroche',
      pointsForts: 'Autonome',
    }
    const stored = serializeAnonymizedDossier(dossier)
    expect(parseAnonymizedDossier(stored)).toEqual(dossier)
  })

  it('returns null for legacy free markdown', () => {
    expect(parseAnonymizedDossier('## Profil\n\nTexte libre')).toBeNull()
    expect(parseAnonymizedDossier(null)).toBeNull()
    expect(parseAnonymizedDossier('')).toBeNull()
  })
})

describe('nonEmptyAnonymizedSections + export', () => {
  it('omits empty sections from preview list and export text', () => {
    const dossier = {
      ...emptyAnonymizedDossier(),
      accroche: 'Accroche',
      mobilite: '  ',
      pointsForts: 'Discret',
    }
    const sections = nonEmptyAnonymizedSections(dossier)
    expect(sections.map((s) => s.key)).toEqual(['accroche', 'pointsForts'])
    const exportText = formatAnonymizedDossierExport(dossier)
    expect(exportText).toContain('Accroche')
    expect(exportText).toContain('Points forts')
    expect(exportText).not.toContain('Mobilité')
  })
})
