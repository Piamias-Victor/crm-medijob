import { describe, expect, it } from 'vitest'
import { matchesPharmacyScrapeFilters } from '@/view-models/pharmacy-scrape-list-filters'

const row = {
  name: 'PHARMACIE LYON NORD',
  email: 'nord@example.com',
  city: 'LYON',
  department: '69',
  provenance: 'Globale',
}

describe('matchesPharmacyScrapeFilters', () => {
  it('matches text against name, email, or city', () => {
    expect(matchesPharmacyScrapeFilters(row, { q: 'nord' })).toBe(true)
    expect(matchesPharmacyScrapeFilters(row, { q: 'example.com' })).toBe(true)
    expect(matchesPharmacyScrapeFilters(row, { q: 'paris' })).toBe(false)
  })

  it('filters by department and provenance', () => {
    expect(matchesPharmacyScrapeFilters(row, { department: '69' })).toBe(true)
    expect(matchesPharmacyScrapeFilters(row, { department: '75' })).toBe(false)
    expect(matchesPharmacyScrapeFilters(row, { provenance: 'Globale' })).toBe(true)
    expect(matchesPharmacyScrapeFilters(row, { provenance: 'OCP' })).toBe(false)
  })

  it('when duplicatesOnly, requires email in the duplicate set', () => {
    const dups = new Set(['nord@example.com'])
    expect(matchesPharmacyScrapeFilters(row, { duplicatesOnly: true }, dups)).toBe(true)
    expect(matchesPharmacyScrapeFilters(row, { duplicatesOnly: true }, new Set())).toBe(false)
  })
})
