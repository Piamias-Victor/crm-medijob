import type { MissionStatus } from '@prisma/client'

export type ContactDetailEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  contactRoleId: string
  isPrimary: boolean
  notes: string | null
  pharmacyId: string
  referentId: string | null
  updatedAt: Date
  pharmacy: { id: string; name: string }
  contactRole: { id: string; name: string }
}

export type ContactDetailPayload = {
  id: string
  fullName: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  contactRoleId: string
  roleName: string
  isPrimary: boolean
  notes: string | null
  pharmacyId: string
  pharmacyName: string
  pharmacy: { id: string; name: string }
  referentId: string | null
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
