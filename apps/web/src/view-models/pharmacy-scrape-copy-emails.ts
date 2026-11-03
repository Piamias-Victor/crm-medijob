/** Unique emails, sorted, `; `-joined — paste into Brevo or classic BCC. */
export function formatScrapeEmailsForClipboard(rows: { email: string }[]): string {
  const unique = [...new Set(rows.map((r) => r.email.trim().toLowerCase()).filter(Boolean))]
  unique.sort((a, b) => a.localeCompare(b))
  return unique.join('; ')
}

export function countUniqueScrapeEmails(rows: { email: string }[]): number {
  return new Set(rows.map((r) => r.email.trim().toLowerCase()).filter(Boolean)).size
}
