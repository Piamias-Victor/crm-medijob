import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'

type Input = {
  pharmacyEmail: string | null
  primaryContactEmail: string | null
}

function firstValidEmail(...candidates: Array<string | null | undefined>) {
  for (const value of candidates) {
    const trimmed = value?.trim() ?? ''
    if (isValidEmailRecipient(trimmed)) return trimmed
  }
  return null
}

export function resolvePharmacyOutreachEmail(input: Input) {
  return firstValidEmail(input.primaryContactEmail, input.pharmacyEmail)
}
