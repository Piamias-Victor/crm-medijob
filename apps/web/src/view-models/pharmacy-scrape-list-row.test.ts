import { describe, expect, it } from 'vitest'
import { toPharmacyScrapeListRows } from '@/view-models/pharmacy-scrape-list-row'

describe('toPharmacyScrapeListRows', () => {
  it('flags scrape email duplicates', () => {
    const rows = toPharmacyScrapeListRows(
      [
        {
          id: '1',
          provenance: 'A',
          email: 'x@y.com',
          name: 'N1',
          department: '69',
          city: 'Lyon',
          scrapedAt: new Date(),
        },
        {
          id: '2',
          provenance: 'B',
          email: 'solo@y.com',
          name: 'N2',
          department: '69',
          city: 'Lyon',
          scrapedAt: new Date(),
        },
      ],
      new Set(['x@y.com']),
    )
    expect(rows[0]?.isDuplicate).toBe(true)
    expect(rows[1]?.isDuplicate).toBe(false)
  })
})
