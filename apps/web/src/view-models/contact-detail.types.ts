import type { ContactRole, MissionStatus } from '@prisma/client'

export type ContactDetailEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  role: ContactRole
  isPrimary: boolean
  notes: string | null
  pharmacyId: string
  updatedAt: Date
  pharmacy: { id: string; name: string }
}

export type ContactDetailPayload = {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  role: ContactRole
  isPrimary: boolean
  notes: string | null
  pharmacyId: string
  pharmacyName: string
  pharmacy: { id: string; name: string }
  updatedAt: Date
}

export type ContactMissionEntity = {
  id: string
  title: string
  status: MissionStatus
  pharmacy: { name: string }
}

export type ContactMissionRow = {
  id: string
  title: string
  status: MissionStatus
  pharmacy: { name: string }
}
