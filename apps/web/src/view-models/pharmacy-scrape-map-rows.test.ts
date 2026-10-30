import { describe, expect, it } from 'vitest'
import { mapPharmacyScrapeEdithRows } from '@/view-models/pharmacy-scrape-map-rows'

const row = (overrides: Record<string, string> = {}) => ({
  Provenance: 'Globale',
  Date: '2025-01-15',
  Nom: 'PHARMACIE TEST',
  CP: '69',
  Ville: 'LYON',
  Mail: 'a@example.com',
  ...overrides,
})

describe('mapPharmacyScrapeEdithRows', () => {
  it('maps a valid EDITH row', () => {
    const { rows, skipped } = mapPharmacyScrapeEdithRows([row()])
    expect(skipped).toEqual([])
    expect(rows).toEqual([
      {
        provenance: 'Globale',
        scrapedAt: expect.any(Date),
        name: 'PHARMACIE TEST',
        department: '69',
        city: 'LYON',
        email: 'a@example.com',
      },
    ])
  })

  it('skips empty or invalid email and lists them', () => {
    const { rows, skipped } = mapPharmacyScrapeEdithRows([
      row({ Mail: '' }),
      row({ Mail: 'not-an-email', Nom: 'BAD' }),
    ])
    expect(rows).toEqual([])
    expect(skipped).toHaveLength(2)
  })

  it('keeps last row when email+provenance collide in the file', () => {
    const { rows } = mapPharmacyScrapeEdithRows([
      row({ Nom: 'FIRST', Ville: 'A' }),
      row({ Nom: 'SECOND', Ville: 'B' }),
    ])
    expect(rows).toHaveLength(1)
    expect(rows[0]?.name).toBe('SECOND')
    expect(rows[0]?.city).toBe('B')
  })

  it('keeps two rows when same email has different provenance', () => {
    const { rows } = mapPharmacyScrapeEdithRows([
      row({ Provenance: 'Airtable', Nom: 'A' }),
      row({ Provenance: 'Globale', Nom: 'B' }),
    ])
    expect(rows).toHaveLength(2)
  })
})
