export const AVAILABILITY_SMS_DEPARTMENTS = [
  '06',
  '13',
  '75',
  '77',
  '78',
  '83',
  '91',
  '92',
  '93',
  '94',
  '95',
] as const

export function inAvailabilitySmsZone(postalCode: string | null | undefined): boolean {
  const code = postalCode?.trim() ?? ''
  if (!code) return false
  return AVAILABILITY_SMS_DEPARTMENTS.some((dept) => code.startsWith(dept))
}
