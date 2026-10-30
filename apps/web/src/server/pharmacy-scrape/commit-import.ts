import type { PharmacyScrapeMappedRow } from '@/view-models/pharmacy-scrape-normalize'

export type PharmacyScrapeUpsertResult = { id: string; created: boolean }

export type CommitPharmacyScrapeDeps = {
  upsert: (row: PharmacyScrapeMappedRow) => Promise<PharmacyScrapeUpsertResult>
}

export type CommitPharmacyScrapeResult = { created: number; updated: number }

export async function commitPharmacyScrapeImport(
  rows: PharmacyScrapeMappedRow[],
  deps: CommitPharmacyScrapeDeps,
): Promise<CommitPharmacyScrapeResult> {
  let created = 0
  let updated = 0
  for (const row of rows) {
    const result = await deps.upsert(row)
    if (result.created) created += 1
    else updated += 1
  }
  return { created, updated }
}
