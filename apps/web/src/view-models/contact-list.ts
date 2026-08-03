import { candidateDepartment } from '@/view-models/cvtheque-core-fields'

// View-model : pont entre Contact et colonnes liste (SPEC_V2 §6.658 / CSV V1-022).

export type ContactListEntity = {
  id: string
  firstName: string
  lastName: string
  phone: string | null
  email: string | null
  isPrimary: boolean
  createdAt: Date
  contactRole: { id: string; name: string }
  pharmacy: { name: string; city: string | null; postalCode: string | null }
}

export type ContactListRow = {
  id: string
  firstName: string
  lastName: string
  roleName: string
  pharmacyName: string
  phone: string | null
  email: string | null
  createdAtLabel: string
  isPrimary: boolean
  city: string | null
  department: string | null
}

const dateFmt = new Intl.DateTimeFormat('fr-FR')

export function toContactListRow(entity: ContactListEntity): ContactListRow {
  return {
    id: entity.id,
    firstName: entity.firstName,
    lastName: entity.lastName,
    roleName: entity.contactRole.name,
    pharmacyName: entity.pharmacy.name,
    phone: entity.phone,
    email: entity.email,
    createdAtLabel: dateFmt.format(entity.createdAt),
    isPrimary: entity.isPrimary,
    city: entity.pharmacy.city,
    department: candidateDepartment(entity.pharmacy.postalCode),
  }
}
