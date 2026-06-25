import type { PharmacyStatus } from '@/view-models/pharmacy-form.schema'

// View-model : pont entre l'entité Pharmacy et les colonnes liste (SPEC_V2 §6.649).

export type PharmacyListEntity = {
  id: string
  name: string
  city: string | null
  status: PharmacyStatus
  groupement: { name: string } | null
  software: { name: string } | null
  contacts: { firstName: string; lastName: string; isPrimary: boolean }[]
  _count: { missions: number }
}

export type PharmacyListRow = {
  id: string
  name: string
  city: string | null
  groupementName: string | null
  status: PharmacyStatus
  primaryContactName: string | null
  missionCount: number
  softwareName: string | null
}

export function toPharmacyListRow(entity: PharmacyListEntity): PharmacyListRow {
  const primary = entity.contacts.find((c) => c.isPrimary)
  return {
    id: entity.id,
    name: entity.name,
    city: entity.city,
    groupementName: entity.groupement?.name ?? null,
    status: entity.status,
    primaryContactName: primary ? `${primary.firstName} ${primary.lastName}` : null,
    missionCount: entity._count.missions,
    softwareName: entity.software?.name ?? null,
  }
}
