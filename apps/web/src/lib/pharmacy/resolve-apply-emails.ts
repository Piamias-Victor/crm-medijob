import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'

type Input = {
  pharmacyEmail: string | null
  primaryContactEmail: string | null
}

export function resolvePharmacyApplyEmails(input: Input) {
  const seen = new Set<string>()
  const emails: string[] = []
  for (const value of [input.pharmacyEmail, input.primaryContactEmail]) {
    const trimmed = value?.trim() ?? ''
    const key = trimmed.toLowerCase()
    if (!isValidEmailRecipient(trimmed) || seen.has(key)) continue
    seen.add(key)
    emails.push(trimmed)
  }
  return emails
}
