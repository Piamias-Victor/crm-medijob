import { describe, it, expect } from 'vitest'
import {
  foldSearchText,
  foldedIncludes,
  matchesFoldedCandidateSearch,
} from '@/lib/search-fold'

describe('foldSearchText', () => {
  it('ignores case and accents when matching search terms', () => {
    expect(foldSearchText('  ÉLÉONORE  ')).toBe('eleonore')
    expect(foldedIncludes('François Dupont', 'francois')).toBe(true)
    expect(foldedIncludes('Lyon', 'LYON')).toBe(true)
  })
})

describe('matchesFoldedCandidateSearch', () => {
  it('matches job title, city and postal code without accents or case', () => {
    const row = {
      firstName: 'Camille',
      lastName: 'Durand',
      city: 'Saint-Étienne',
      postalCode: '42000',
      jobTitle: { name: 'Préparateur' },
    }

    expect(matchesFoldedCandidateSearch(row, 'preparateur')).toBe(true)
    expect(matchesFoldedCandidateSearch(row, 'etienne')).toBe(true)
    expect(matchesFoldedCandidateSearch(row, '42000')).toBe(true)
  })
})
