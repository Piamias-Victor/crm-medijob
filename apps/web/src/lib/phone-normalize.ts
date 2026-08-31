export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function phonesMatch(left: string, right: string): boolean {
  const a = normalizePhoneDigits(left)
  const b = normalizePhoneDigits(right)
  return a.length > 0 && a === b
}

export function toSmsRecipient(phone: string): string | null {
  const digits = normalizePhoneDigits(phone)
  if (digits.length === 10 && digits.startsWith('0')) return `33${digits.slice(1)}`
  if (digits.startsWith('33') && digits.length >= 11) return digits
  return digits.length >= 10 ? digits : null
}
