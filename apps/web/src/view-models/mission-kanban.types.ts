import { MISSION_STATUS_ORDER } from '@/lib/mission-options'

export type MissionStatus = (typeof MISSION_STATUS_ORDER)[number]

export type RawMission = {
  id: string
  title: string
  status: MissionStatus
  startDate: Date
  jobTitle: { name: string } | null
  pharmacy: { name: string; city: string | null }
  referent: { name: string | null } | null
}

export type MissionListItem = {
  id: string
  title: string
  jobTitle: string | null
  pharmacyName: string
  city: string | null
  status: MissionStatus
  referent: string | null
  startDate: Date
}

export type MissionKanbanCard = {
  missionId: string
  title: string
  jobTitle: string | null
  pharmacyName: string
  city: string | null
  referent: string | null
  fromStatus: MissionStatus
}

export type MissionKanbanColumn = {
  status: MissionStatus
  label: string
  cards: MissionKanbanCard[]
}
