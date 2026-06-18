import type { ContactRole } from '@prisma/client'

// View-model : pont entre Contact et colonnes liste (SPEC_V2 §6.658).

export type ContactListEntity = {
  id: string
  firstName: string
  lastName: string
  role: ContactRole
  phone: string | null
  email: string | null
  createdAt: Date
  pharmacy: { name: string }
}

export type ContactListRow = {
  id: string
  fullName: string
  role: ContactRole
  pharmacyName: string
  phone: string | null
  email: string | null
  createdAtLabel: string
}

const dateFmt = new Intl.DateTimeFormat('fr-FR')

export function toContactListRow(entity: ContactListEntity): ContactListRow {
  return {
    id: entity.id,
    fullName: `${entity.firstName} ${entity.lastName}`,
    role: entity.role,
    pharmacyName: entity.pharmacy.name,
    phone: entity.phone,
    email: entity.email,
    createdAtLabel: dateFmt.format(entity.createdAt),
  }
}
