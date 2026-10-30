/** EDITH `CP` → department code for Pharmacy scrape UI (not Pharmacy postalCode). */
export function toScrapeDepartment(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null
  const digits = trimmed.endsWith('.0') ? trimmed.slice(0, -2) : trimmed
  if (!/^\d{2,5}$/.test(digits)) return null
  if (digits.length === 2) return digits
  return digits.slice(0, 2)
}
