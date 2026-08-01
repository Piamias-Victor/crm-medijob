import type { ContactInput } from '@/view-models/contact-form.schema'

type PharmacyRef = { id: string; name: string }

export function resolveContactCreatePharmacy(
  pharmacyId: string | undefined,
  pharmacies: readonly PharmacyRef[],
): string | undefined {
  if (!pharmacyId) return undefined
  return pharmacies.some((pharmacy) => pharmacy.id === pharmacyId) ? pharmacyId : undefined
}

export function resolveContactCreateReferent(
  pharmacyReferentId: string | null | undefined,
  sessionUserId: string | undefined,
): string | null {
  return pharmacyReferentId ?? sessionUserId ?? null
}

export function buildContactCreateDefaults(opts?: {
  pharmacyId?: string
  referentId?: string | null
}): Partial<ContactInput> {
  return {
    role: 'AUTRE',
    isPrimary: false,
    referentId: opts?.referentId ?? null,
    ...(opts?.pharmacyId ? { pharmacyId: opts.pharmacyId } : {}),
  }
}
