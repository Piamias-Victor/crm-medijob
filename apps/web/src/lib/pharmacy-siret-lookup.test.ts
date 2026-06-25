import { describe, expect, it } from 'vitest'
import { formatSiretLookupLabel, resolveSiretSearchResults } from '@/lib/pharmacy-siret-lookup'

const match = {
  siret: '52187506200015',
  name: 'PHARMACIE LYON AEROPORT',
  address: 'AEROPORT LYON',
  city: 'COLOMBIER-SAUGNIEU',
  postalCode: '69124',
}

describe('resolveSiretSearchResults', () => {
  it('returns empty when the annuaire has no match', () => {
    expect(resolveSiretSearchResults([])).toEqual({ kind: 'empty' })
  })

  it('auto-fills when a single match is returned', () => {
    expect(resolveSiretSearchResults([match])).toEqual({ kind: 'single', match })
  })

  it('asks the user to pick when several matches are returned', () => {
    const other = { ...match, siret: '99999999999999', name: 'AUTRE PHARMACIE' }
    expect(resolveSiretSearchResults([match, other])).toEqual({
      kind: 'multiple',
      matches: [match, other],
    })
  })
})

describe('formatSiretLookupLabel', () => {
  it('includes name, city and siret for the picker', () => {
    expect(formatSiretLookupLabel(match)).toBe(
      'PHARMACIE LYON AEROPORT · 69124 COLOMBIER-SAUGNIEU · SIRET 52187506200015',
    )
  })
})
