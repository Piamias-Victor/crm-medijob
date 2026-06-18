import type {
  ContactDetailEntity,
  ContactDetailPayload,
  ContactMissionEntity,
  ContactMissionRow,
} from '@/view-models/contact-detail.types'

export type {
  ContactDetailEntity,
  ContactDetailPayload,
  ContactMissionEntity,
  ContactMissionRow,
} from '@/view-models/contact-detail.types'

export function toContactDetail(entity: ContactDetailEntity): ContactDetailPayload {
  return {
    id: entity.id,
    fullName: `${entity.firstName} ${entity.lastName}`.trim(),
    firstName: entity.firstName,
    lastName: entity.lastName,
    email: entity.email,
    phone: entity.phone,
    role: entity.role,
    isPrimary: entity.isPrimary,
    notes: entity.notes,
    pharmacyId: entity.pharmacyId,
    pharmacyName: entity.pharmacy.name,
    pharmacy: entity.pharmacy,
    updatedAt: entity.updatedAt,
  }
}

export function toContactMissionRows(missions: ContactMissionEntity[]): ContactMissionRow[] {
  return missions.map((m) => ({
    id: m.id,
    title: m.title,
    status: m.status,
    pharmacy: m.pharmacy,
  }))
}
