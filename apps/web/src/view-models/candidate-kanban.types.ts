import type { MissionStatus } from '@prisma/client'

export type RawStage = { id: string; name: string; position: number }

export type RawMissionRow = {
  stageId: string
  stage: RawStage
  mission: { id: string; title: string; status: MissionStatus }
}

export type RawCandidate = {
  id: string
  firstName: string
  lastName: string
  city: string | null
  postalCode: string | null
  availableFrom: Date | null
  jobTitle: { name: string } | null
  referent: { name: string } | null
  missions: RawMissionRow[]
}

export type MissionCard = {
  missionId: string
  candidateId: string
  title: string
  stageId: string
  stageName: string
}

export type CandidateCard = {
  candidateId: string
  name: string
  jobTitle: string | null
  city: string | null
  referent: string | null
  rows: MissionCard[]
}

export type KanbanColumn = { stage: RawStage; cards: CandidateCard[] }

export type CandidateListItem = {
  id: string
  name: string
  jobTitle: string | null
  city: string | null
  referent: string | null
  activeMissionCount: number
}
