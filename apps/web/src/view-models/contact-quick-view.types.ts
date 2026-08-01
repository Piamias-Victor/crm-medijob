export type ContactQuickViewEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  isPrimary: boolean
  contactRole: { name: string }
  pharmacy: { id: string; name: string; city: string | null }
}

export type ContactQuickViewPayload = {
  id: string
  fullName: string
  roleName: string
  isPrimary: boolean
  email: string | null
  phone: string | null
  pharmacyName: string
  city: string | null
}
