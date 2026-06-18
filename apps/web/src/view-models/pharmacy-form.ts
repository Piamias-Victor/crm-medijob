import type { PharmacyInput, PharmacyStatus } from '@/view-models/pharmacy-form.schema'

export type PharmacyFormSource = {
  name: string
  siret: string | null
  numeroTVA: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  phone: string | null
  email: string | null
  website: string | null
  status: PharmacyStatus
  groupementId: string | null
  softwareId: string | null
}

export function toPharmacyFormValues(p: PharmacyFormSource): Partial<PharmacyInput> {
  return {
    name: p.name,
    siret: p.siret ?? undefined,
    numeroTVA: p.numeroTVA ?? undefined,
    address: p.address ?? undefined,
    city: p.city ?? undefined,
    postalCode: p.postalCode ?? undefined,
    phone: p.phone ?? undefined,
    email: p.email ?? undefined,
    website: p.website ?? undefined,
    status: p.status,
    groupementId: p.groupementId ?? undefined,
    softwareId: p.softwareId ?? undefined,
  }
}
