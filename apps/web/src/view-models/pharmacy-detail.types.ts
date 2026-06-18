import type { ContactRole, ContractType, MissionStatus, PharmacyStatus } from '@prisma/client'

export type PharmacyContactEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  role: ContactRole
  isPrimary: boolean
}

export type PharmacyMissionEntity = {
  id: string
  title: string
  status: MissionStatus
  contractType: ContractType
  startDate: Date
  jobTitle: { name: string }
  referent: { name: string }
}

export type PharmacyDetailEntity = {
  id: string
  name: string
  siret: string | null
  numeroTVA: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  phone: string | null
  email: string | null
  website: string | null
  status: PharmacyStatus
  groupementId: string | null
  softwareId: string | null
  paymentConditions: string | null
  notes: string | null
  updatedAt: Date
  groupement: { id: string; name: string } | null
  software: { id: string; name: string } | null
  contacts: PharmacyContactEntity[]
  missions: PharmacyMissionEntity[]
}

export type PharmacyContactRow = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  role: ContactRole
  isPrimary: boolean
}

export type PharmacyMissionRow = {
  id: string
  title: string
  status: MissionStatus
  contractType: ContractType
  startDate: Date
  jobTitle: string
  referent: string
}

export type PharmacyDetailPayload = {
  id: string
  name: string
  city: string | null
  status: PharmacyStatus
  groupementName: string | null
  softwareName: string | null
  primaryContactName: string | null
  updatedAt: Date
  formSource: Omit<PharmacyDetailEntity, 'contacts' | 'missions' | 'groupement' | 'software'>
  contacts: PharmacyContactRow[]
  activeMissions: PharmacyMissionRow[]
}
