import type { Pharmacy } from '@prisma/client'
import type { PharmacyInput } from '@/server/routers/pharmacy.schema'

// View-model : entité Pharmacy → valeurs par défaut du formulaire d'édition.
export function toPharmacyFormValues(p: Pharmacy): Partial<PharmacyInput> {
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
