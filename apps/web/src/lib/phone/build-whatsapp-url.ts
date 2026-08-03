import { normalizeFrPhoneDigits } from '@/lib/phone/normalize-fr-phone'

export function buildWhatsAppUrl(phone: string | null | undefined): string | null {
  const digits = normalizeFrPhoneDigits(phone)
  return digits ? `https://wa.me/${digits}` : null
}
