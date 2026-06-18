import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import type {
  PharmacyContactEntity,
  PharmacyContactRow,
  PharmacyDetailEntity,
  PharmacyDetailPayload,
  PharmacyMissionEntity,
  PharmacyMissionRow,
} from '@/view-models/pharmacy-detail.types'

export type {
  PharmacyContactEntity,
  PharmacyContactRow,
  PharmacyDetailEntity,
  PharmacyDetailPayload,
  PharmacyMissionEntity,
  PharmacyMissionRow,
} from '@/view-models/pharmacy-detail.types'

export function toPharmacyContactRows(contacts: PharmacyContactEntity[]): PharmacyContactRow[] {
  return contacts.map((c) => ({
    id: c.id,
    fullName: `${c.firstName} ${c.lastName}`.trim(),
    email: c.email,
    phone: c.phone,
    role: c.role,
    isPrimary: c.isPrimary,
  }))
}

export function toPharmacyMissionRows(missions: PharmacyMissionEntity[]): PharmacyMissionRow[] {
  return missions
    .filter((m) => !isTerminalMissionStatus(m.status))
    .map((m) => ({
      id: m.id,
      title: m.title,
      status: m.status,
      contractType: m.contractType,
      startDate: m.startDate,
      jobTitle: m.jobTitle.name,
      referent: m.referent.name,
    }))
}

export function toPharmacyDetail(entity: PharmacyDetailEntity): PharmacyDetailPayload {
  const primary = entity.contacts.find((c) => c.isPrimary)
  const { contacts, missions, groupement, software, ...formSource } = entity

  return {
    id: entity.id,
    name: entity.name,
    city: entity.city,
    status: entity.status,
    groupementName: groupement?.name ?? null,
    softwareName: software?.name ?? null,
    primaryContactName: primary ? `${primary.firstName} ${primary.lastName}`.trim() : null,
    updatedAt: entity.updatedAt,
    formSource,
    contacts: toPharmacyContactRows(contacts),
    activeMissions: toPharmacyMissionRows(missions),
  }
}
