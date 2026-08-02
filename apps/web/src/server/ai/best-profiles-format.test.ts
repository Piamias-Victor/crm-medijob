// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { formatBestProfilesContext } from '@/server/ai/best-profiles-format'

describe('formatBestProfilesContext', () => {
  it('lists top scored candidates with score and justification', () => {
    const text = formatBestProfilesContext({
      scored: [
        {
          candidateId: 'c1',
          fullName: 'Ada Lovelace',
          jobTitle: 'Pharmacien',
          city: 'Lyon',
          score: 92,
          justification: 'Titre + ville',
        },
        {
          candidateId: 'c2',
          fullName: 'Alan Turing',
          jobTitle: 'Préparateur',
          city: 'Villeurbanne',
          score: 81,
          justification: 'Mobilité OK',
        },
      ],
      topN: 1,
    })

    expect(text).toContain('1. Ada Lovelace')
    expect(text).toContain('score 92')
    expect(text).toContain('Titre + ville')
    expect(text).not.toContain('Alan Turing')
  })

  it('states when matching returned no scored candidates', () => {
    const text = formatBestProfilesContext({ scored: [], topN: 5 })
    expect(text).toContain('aucun candidat scoré')
  })
})
