import { describe, expect, it } from 'vitest'
import { buildPharmacyScrapePreview } from '@/server/pharmacy-scrape/preview-import'
import type { PharmacyScrapeMappedRow } from '@/view-models/pharmacy-scrape-normalize'

const row = (email: string, provenance: string): PharmacyScrapeMappedRow => ({
  email,
  provenance,
  name: 'N',
  department: '69',
  city: 'Lyon',
  scrapedAt: new Date(),
})

describe('buildPharmacyScrapePreview', () => {
  it('counts mapped rows, skipped, and emails that appear under multiple provenances', () => {
    const preview = buildPharmacyScrapePreview({
      rows: [
        row('a@x.com', 'Globale'),
        row('a@x.com', 'OCP'),
        row('b@x.com', 'Globale'),
      ],
      skipped: [{ row: 9, reason: 'Email invalide' }],
    })
    expect(preview).toEqual({
      rowCount: 3,
      skippedCount: 1,
      duplicateEmailCount: 1,
      skipped: [{ row: 9, reason: 'Email invalide' }],
    })
  })
})
