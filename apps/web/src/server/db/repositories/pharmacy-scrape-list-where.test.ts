import { describe, expect, it } from 'vitest'
import { buildPharmacyScrapeListWhere } from '@/server/db/repositories/pharmacy-scrape-list-where'

describe('buildPharmacyScrapeListWhere', () => {
  it('always excludes soft-deleted rows', () => {
    expect(buildPharmacyScrapeListWhere({})).toEqual({ deletedAt: null })
  })

  it('adds department, provenance, and text search', () => {
    const where = buildPharmacyScrapeListWhere({
      q: 'lyon',
      department: '69',
      provenance: 'Globale',
    })
    expect(where).toMatchObject({
      deletedAt: null,
      department: '69',
      provenance: 'Globale',
    })
    expect(where.AND).toBeDefined()
  })

  it('restricts to duplicate emails when requested', () => {
    const where = buildPharmacyScrapeListWhere(
      { duplicatesOnly: true },
      ['a@x.com', 'b@x.com'],
    )
    expect(where.email).toEqual({ in: ['a@x.com', 'b@x.com'] })
  })
})
