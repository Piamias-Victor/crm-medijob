import type { MissionStatus } from '@prisma/client'
import type { ActivityLogEntity } from '@/view-models/activity-log'

export type PharmacyQuickViewContactEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  isPrimary: boolean
}

export type PharmacyQuickViewMissionEntity = {
  id: string
  title: string
  status: MissionStatus
  jobTitle: { name: string }
}

export type PharmacyQuickViewEntity = {
  id: string
  name: string
  address: string | null
  postalCode: string | null
  city: string | null
  phone: string | null
  email: string | null
  contacts: PharmacyQuickViewContactEntity[]
  missions: PharmacyQuickViewMissionEntity[]
  lastActivity: ActivityLogEntity | null
}

export type PharmacyQuickViewCoordinates = {
  address: string | null
  postalCode: string | null
  city: string | null
  phone: string | null
  email: string | null
}

export type PharmacyQuickViewContact = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
}

export type PharmacyQuickViewNeed = {
  id: string
  title: string
  status: MissionStatus
  jobTitle: string
}

export type PharmacyQuickViewLastAction = {
  typeLabel: string
  dateLabel: string
  content: string | null
  authorName: string
}

export type PharmacyQuickViewPayload = {
  id: string
  name: string
  coordinates: PharmacyQuickViewCoordinates
  primaryContacts: PharmacyQuickViewContact[]
  openNeeds: PharmacyQuickViewNeed[]
  lastAction: PharmacyQuickViewLastAction | null
}
