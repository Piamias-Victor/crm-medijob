import type { PharmacyStatus } from '@/view-models/pharmacy-form.schema'
import { formatDateFr } from '@/view-models/format-date-fr'

// View-model : pont entre l'entité Pharmacy et les colonnes liste (CSV V1-011).

export type PharmacyListEntity = {
  id: string
  name: string
  city: string | null
  postalCode: string | null
  createdAt: Date
  status: PharmacyStatus
  groupement: { name: string } | null
  software: { name: string } | null
  referent: { name: string } | null
  contacts: { firstName: string; lastName: string; isPrimary: boolean }[]
  _count: { missions: number }
}

export type PharmacyListRow = {
  id: string
  name: string
  city: string | null
  postalCode: string | null
  createdAtLabel: string
  groupementName: string | null
  status: PharmacyStatus
  primaryContactName: string | null
  missionCount: number
  softwareName: string | null
  referentName: string | null
}

export function toPharmacyListRow(entity: PharmacyListEntity): PharmacyListRow {
  const primary = entity.contacts.find((c) => c.isPrimary)
  return {
    id: entity.id,
    name: entity.name,
    city: entity.city,
    postalCode: entity.postalCode,
    createdAtLabel: formatDateFr(entity.createdAt),
    groupementName: entity.groupement?.name ?? null,
    status: entity.status,
    primaryContactName: primary ? `${primary.firstName} ${primary.lastName}` : null,
    missionCount: entity._count.missions,
    softwareName: entity.software?.name ?? null,
    referentName: entity.referent?.name ?? null,
  }
}
