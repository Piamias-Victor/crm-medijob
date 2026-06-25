import type { ContactInput } from '@/view-models/contact-form.schema'

type PharmacyRef = { id: string; name: string }

export function resolveContactCreatePharmacy(
  pharmacyId: string | undefined,
  pharmacies: readonly PharmacyRef[],
): string | undefined {
  if (!pharmacyId) return undefined
  return pharmacies.some((pharmacy) => pharmacy.id === pharmacyId) ? pharmacyId : undefined
}

export function buildContactCreateDefaults(pharmacyId?: string): Partial<ContactInput> {
  return {
    role: 'AUTRE',
    isPrimary: false,
    ...(pharmacyId ? { pharmacyId } : {}),
  }
}
