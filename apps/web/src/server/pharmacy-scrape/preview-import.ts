import type { PharmacyScrapeMappedRow } from '@/view-models/pharmacy-scrape-normalize'
import type { PharmacyScrapeSkip } from '@/view-models/pharmacy-scrape-map-rows'

export type PharmacyScrapePreview = {
  rowCount: number
  skippedCount: number
  duplicateEmailCount: number
  skipped: PharmacyScrapeSkip[]
}

export function buildPharmacyScrapePreview(input: {
  rows: PharmacyScrapeMappedRow[]
  skipped: PharmacyScrapeSkip[]
}): PharmacyScrapePreview {
  const byEmail = new Map<string, number>()
  for (const row of input.rows) {
    byEmail.set(row.email, (byEmail.get(row.email) ?? 0) + 1)
  }
  let duplicateEmailCount = 0
  for (const count of byEmail.values()) {
    if (count > 1) duplicateEmailCount += 1
  }
  return {
    rowCount: input.rows.length,
    skippedCount: input.skipped.length,
    duplicateEmailCount,
    skipped: input.skipped.slice(0, 50),
  }
}
