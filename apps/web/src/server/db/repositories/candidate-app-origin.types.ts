export type AppIdentityPatch = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  jobTitleId?: string
  cvUrl?: string
  nir?: string
  iban?: string
}

export type AppOriginCreateInput = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  jobTitleId: string
  origin: 'APP'
  status: 'NOUVEAU'
  badakanId: string
  notes?: string
  availableFrom?: Date
  mobilityRadiusKm?: number
  mobilityNotes?: string
  softwareIds?: string[]
}

export const APP_LINKED_SELECT = {
  id: true,
  origin: true,
  status: true,
  statusBeforeInactive: true,
  badakanValidatedAt: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  address: true,
  city: true,
  postalCode: true,
  jobTitleId: true,
  jobTitle: { select: { name: true } },
  nir: true,
  iban: true,
} as const
