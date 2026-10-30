export type PharmacyScrapeMappedRow = {
  provenance: string
  scrapedAt: Date
  name: string
  department: string | null
  city: string | null
  email: string
}

export function normalizeScrapeEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function normalizeScrapeProvenance(raw: string): string {
  return raw.trim()
}

export function isValidScrapeEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function scrapeRowKey(email: string, provenance: string): string {
  return `${normalizeScrapeEmail(email)}\0${normalizeScrapeProvenance(provenance)}`
}
