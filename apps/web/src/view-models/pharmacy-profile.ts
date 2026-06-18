export type PharmacyLocationFields = {
  city: string | null | undefined
  postalCode: string | null | undefined
}

export const PHARMACY_FIELD_LABELS: Record<string, string> = {
  city: 'Ville',
  postalCode: 'Code postal',
}

export function getMissingPharmacyFields(profile: PharmacyLocationFields): string[] {
  const missing: string[] = []
  if (!profile.city?.trim()) missing.push('city')
  if (!profile.postalCode?.trim()) missing.push('postalCode')
  return missing
}
