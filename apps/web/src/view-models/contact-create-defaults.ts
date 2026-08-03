import type { ContactInput } from '@/view-models/contact-form.schema'

type PharmacyRef = { id: string; name: string }
type ContactRoleRef = { id: string; name: string }

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

export function resolveDefaultContactRoleId(
  contactRoles: readonly ContactRoleRef[],
  preferredName = 'Autre',
): string | undefined {
  return contactRoles.find((role) => role.name === preferredName)?.id ?? contactRoles[0]?.id
}

export function buildContactCreateDefaults(opts?: {
  pharmacyId?: string
  referentId?: string | null
  contactRoleId?: string
}): Partial<ContactInput> {
  return {
    isPrimary: false,
    referentId: opts?.referentId ?? null,
    ...(opts?.contactRoleId ? { contactRoleId: opts.contactRoleId } : {}),
    ...(opts?.pharmacyId ? { pharmacyId: opts.pharmacyId } : {}),
  }
}
