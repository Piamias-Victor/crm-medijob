import type { ContractType, MissionStatus } from '@prisma/client'
import type { ActivityLogEntity } from '@/view-models/activity-log'

export type MissionQuickViewEntity = {
  id: string
  title: string
  status: MissionStatus
  contractType: ContractType
  jobTitle: { name: string }
  referent: { name: string } | null
  pharmacy: {
    name: string
    address: string | null
    postalCode: string | null
    city: string | null
    phone: string | null
  }
  lastActivity: ActivityLogEntity | null
}

export type MissionQuickViewLastAction = {
  typeLabel: string
  dateLabel: string
  content: string | null
  authorName: string
}

export type MissionQuickViewPayload = {
  id: string
  title: string
  status: MissionStatus
  contractType: ContractType
  jobTitleName: string
  referentName: string | null
  pharmacyName: string
  coordinates: {
    address: string | null
    postalCode: string | null
    city: string | null
    phone: string | null
  }
  lastAction: MissionQuickViewLastAction | null
}
