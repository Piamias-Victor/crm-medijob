import type { PharmacyStatus } from '@/view-models/pharmacy-form.schema'
import { computeNumeroTVA } from '@/lib/tva'
import { toNull } from '@/view-models/to-null'
import { toReferentIdOrNull } from '@/view-models/optional-referent-id.schema'
import { normalizeSiret } from '@/server/pharmacy/normalize-pharmacy-identity'
import type { z } from 'zod'
import type { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'

type PharmacyData = z.output<typeof pharmacyInputSchema>

export type PharmacyUpdate = {
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
  paymentConditions: string | null
  notes: string | null
  referentId: string | null
}

export function toPharmacyUpdateData(data: PharmacyData): PharmacyUpdate {
  const siret = data.siret ? normalizeSiret(data.siret) : undefined
  const numeroTVA = siret
    ? (computeNumeroTVA(siret) ?? data.numeroTVA ?? null)
    : toNull(data.numeroTVA)
  return {
    name: data.name,
    siret: toNull(siret),
    numeroTVA,
    address: toNull(data.address),
    city: toNull(data.city),
    postalCode: toNull(data.postalCode),
    phone: toNull(data.phone),
    email: toNull(data.email),
    website: toNull(data.website),
    status: data.status,
    groupementId: toNull(data.groupementId),
    softwareId: toNull(data.softwareId),
    paymentConditions: toNull(data.paymentConditions),
    notes: toNull(data.notes),
    referentId: toReferentIdOrNull(data.referentId),
  }
}
