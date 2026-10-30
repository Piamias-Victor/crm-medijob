import { describe, expect, it, vi } from 'vitest'
import { commitPharmacyScrapeImport } from '@/server/pharmacy-scrape/commit-import'
import type { PharmacyScrapeMappedRow } from '@/view-models/pharmacy-scrape-normalize'

const base = (overrides: Partial<PharmacyScrapeMappedRow> = {}): PharmacyScrapeMappedRow => ({
  provenance: 'Globale',
  scrapedAt: new Date('2025-01-15'),
  name: 'PHARMA',
  department: '69',
  city: 'LYON',
  email: 'a@example.com',
  ...overrides,
})

describe('commitPharmacyScrapeImport', () => {
  it('upserts each row and reports created vs updated', async () => {
    const upsert = vi
      .fn()
      .mockResolvedValueOnce({ id: '1', created: true })
      .mockResolvedValueOnce({ id: '2', created: false })

    const result = await commitPharmacyScrapeImport(
      [base(), base({ email: 'b@example.com', provenance: 'OCP' })],
      { upsert },
    )

    expect(upsert).toHaveBeenCalledTimes(2)
    expect(result).toEqual({ created: 1, updated: 1 })
  })

  it('passes rows through so soft-deleted keys can reactivate in upsert', async () => {
    const upsert = vi.fn().mockResolvedValue({ id: '1', created: false })
    await commitPharmacyScrapeImport([base()], { upsert })
    expect(upsert).toHaveBeenCalledWith(base())
  })
})
