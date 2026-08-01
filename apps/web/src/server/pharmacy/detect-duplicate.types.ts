export type PharmacyDuplicateIdentity = {
  id: string
  name: string
  siret: string | null
  city: string | null
  postalCode: string | null
  deletedAt: Date | null
}

export type PharmacyDuplicateMatch = {
  pharmacyId: string
  reason: 'siret' | 'name_city_postal'
  name: string
  siret: string | null
  city: string | null
  postalCode: string | null
  deletedAt: Date | null
}
