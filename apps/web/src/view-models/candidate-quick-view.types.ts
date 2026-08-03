import type { CandidateStatus } from '@/view-models/candidate-status'
import type { MissionStatus } from '@prisma/client'

export type CandidateQuickViewMissionEntity = {
  mission: { id: string; title: string; status: MissionStatus }
  stage: { name: string }
}

export type CandidateQuickViewEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  city: string | null
  postalCode: string | null
  status: CandidateStatus
  salaryExpectations: string | null
  salaryMin: number | null
  salaryMax: number | null
  mobilityRadiusKm: number | null
  availableFrom: Date | null
  jobTitle: { name: string }
  referent: { name: string } | null
  missions: CandidateQuickViewMissionEntity[]
}

export type CandidateQuickViewMission = {
  id: string
  title: string
  stageName: string
}

export type CandidateQuickViewPayload = {
  id: string
  fullName: string
  jobTitle: string
  effectiveStatus: CandidateStatus
  city: string | null
  postalCode: string | null
  email: string | null
  phone: string | null
  mobilityRadiusKm: number | null
  availabilityLabel: string
  salaryExpectations: string | null
  salaryMin: number | null
  salaryMax: number | null
  referentName: string | null
  activeMissions: CandidateQuickViewMission[]
}
