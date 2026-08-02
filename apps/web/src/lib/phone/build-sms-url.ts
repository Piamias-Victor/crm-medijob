import { normalizeFrPhoneDigits } from '@/lib/phone/normalize-fr-phone'

export function buildSmsUrl(phone: string | null | undefined): string | null {
  const digits = normalizeFrPhoneDigits(phone)
  return digits ? `sms:+${digits}` : null
}
