import type { ContactRole } from '@prisma/client'
import { candidateDepartment } from '@/view-models/cvtheque-core-fields'

// View-model : pont entre Contact et colonnes liste (SPEC_V2 §6.658).

export type ContactListEntity = {
  id: string
  firstName: string
  lastName: string
  role: ContactRole
  phone: string | null
  email: string | null
  isPrimary: boolean
  createdAt: Date
  pharmacy: { name: string; city: string | null; postalCode: string | null }
}

export type ContactListRow = {
  id: string
  fullName: string
  role: ContactRole
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
    fullName: `${entity.firstName} ${entity.lastName}`,
    role: entity.role,
    pharmacyName: entity.pharmacy.name,
    phone: entity.phone,
    email: entity.email,
    createdAtLabel: dateFmt.format(entity.createdAt),
    isPrimary: entity.isPrimary,
    city: entity.pharmacy.city,
    department: candidateDepartment(entity.pharmacy.postalCode),
  }
}
