import type {
  ContactQuickViewEntity,
  ContactQuickViewPayload,
} from '@/view-models/contact-quick-view.types'

export type {
  ContactQuickViewEntity,
  ContactQuickViewPayload,
} from '@/view-models/contact-quick-view.types'

export function toContactQuickView(entity: ContactQuickViewEntity): ContactQuickViewPayload {
  return {
    id: entity.id,
    fullName: `${entity.firstName} ${entity.lastName}`.trim(),
    roleName: entity.contactRole.name,
    isPrimary: entity.isPrimary,
    email: entity.email,
    phone: entity.phone,
    pharmacyName: entity.pharmacy.name,
    city: entity.pharmacy.city,
  }
}
