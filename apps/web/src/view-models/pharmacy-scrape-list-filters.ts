export type PharmacyScrapeListFilters = {
  q?: string
  department?: string
  provenance?: string
  duplicatesOnly?: boolean
}

export type PharmacyScrapeFilterRow = {
  name: string
  email: string
  city: string | null
  department: string | null
  provenance: string
}

export function matchesPharmacyScrapeFilters(
  row: PharmacyScrapeFilterRow,
  filters: PharmacyScrapeListFilters,
  duplicateEmails: Set<string> = new Set(),
): boolean {
  if (filters.department && row.department !== filters.department) return false
  if (filters.provenance && row.provenance !== filters.provenance) return false
  if (filters.duplicatesOnly && !duplicateEmails.has(row.email)) return false
  const q = filters.q?.trim().toLowerCase()
  if (!q) return true
  const hay = `${row.name} ${row.email} ${row.city ?? ''}`.toLowerCase()
  return hay.includes(q)
}
