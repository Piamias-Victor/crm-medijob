export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, '')
}

export function phonesMatch(left: string, right: string): boolean {
  const a = normalizePhoneDigits(left)
  const b = normalizePhoneDigits(right)
  return a.length > 0 && a === b
}
