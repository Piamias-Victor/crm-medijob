// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { matchesSelection, matchesText } from '@/lib/filters/badakan-filter-match'

describe('matchesText', () => {
  it('accepts every row when the search box is empty', () => {
    expect(matchesText(['Pharmacie Hermes'], '   ')).toBe(true)
  })

  it('ignores case and accents so « herme » finds « Hermès »', () => {
    expect(matchesText(['Pharmacie Hermès'], 'herme')).toBe(true)
  })

  it('searches across every provided field', () => {
    expect(matchesText(['Margo Rié', null, 'Pharmacie du Parc'], 'parc')).toBe(true)
  })

  it('rejects a row matching none of the fields', () => {
    expect(matchesText(['Margo Rié', null], 'hermes')).toBe(false)
  })
})

describe('matchesSelection', () => {
  it('accepts every row when nothing is selected', () => {
    expect(matchesSelection('CANCELLED', [])).toBe(true)
  })

  it('keeps only the selected values', () => {
    expect(matchesSelection('CANCELLED', ['STAFFED', 'CANCELLED'])).toBe(true)
    expect(matchesSelection('DRAFT', ['STAFFED', 'CANCELLED'])).toBe(false)
  })
})
