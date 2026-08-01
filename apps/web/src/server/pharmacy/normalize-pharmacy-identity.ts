export function normalizePharmacyName(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function normalizePostalCode(value: string): string {
  return value.replace(/\s+/g, '')
}

export function normalizeCity(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function normalizeSiret(value: string): string {
  return value.replace(/\s+/g, '')
}

export function identityKeysReady(input: {
  siret?: string
  name?: string
  city?: string
  postalCode?: string
}): boolean {
  if (input.siret && normalizeSiret(input.siret).length > 0) return true
  return Boolean(input.name?.trim() && input.city?.trim() && input.postalCode?.trim())
}
