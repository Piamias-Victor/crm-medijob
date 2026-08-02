export function normalizeFrPhoneDigits(phone: string | null | undefined): string | null {
  if (!phone?.trim()) return null
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('00')) digits = digits.slice(2)
  if (digits.startsWith('0') && digits.length === 10) digits = `33${digits.slice(1)}`
  if (digits.length < 10 || digits.length > 15) return null
  return digits
}
