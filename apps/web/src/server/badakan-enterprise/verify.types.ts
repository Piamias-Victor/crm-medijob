export type EnterpriseVerifyRow = {
  id: string
  name: string
  siret: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  principalFirstName: string | null
  principalLastName: string | null
  principalEmail: string | null
  principalPhone: string | null
  pharmacyId: string | null
  verifiedAt: Date | null
}

export type ExistingPharmacyIdentity = {
  id: string
  name: string
  siret: string | null
}
