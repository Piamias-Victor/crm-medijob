export type PharmacyScrapeListRow = {
  id: string
  provenance: string
  email: string
  name: string
  department: string | null
  city: string | null
  scrapedAt: Date
  isDuplicate: boolean
}

type ScrapeRecord = {
  id: string
  provenance: string
  email: string
  name: string
  department: string | null
  city: string | null
  scrapedAt: Date
}

export function toPharmacyScrapeListRows(
  rows: ScrapeRecord[],
  duplicateEmails: Set<string>,
): PharmacyScrapeListRow[] {
  return rows.map((row) => ({
    ...row,
    isDuplicate: duplicateEmails.has(row.email),
  }))
}
