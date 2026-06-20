import type { ContractType, MissionStatus } from '@prisma/client'

export type MissionCandidateEntity = {
  candidateId: string
  stageId: string
  stage: { id: string; name: string; position: number }
  candidate: {
    firstName: string
    lastName: string
    city: string | null
    postalCode: string | null
    jobTitle: { name: string } | null
    referent: { name: string } | null
  }
}

export type MissionDetailEntity = {
  id: string
  title: string
  description: string | null
  contractType: ContractType
  startDate: Date
  endDate: Date | null
  status: MissionStatus
  salaireMin: number | null
  salaireMax: number | null
  salaireNotes: string | null
  heuresParSemaine: number | null
  planning: string | null
  tempsPlein: boolean
  notes: string | null
  pharmacyId: string
  contactId: string | null
  referentId: string
  jobTitleId: string
  updatedAt: Date
  pharmacy: { name: string; city: string | null }
  jobTitle: { name: string }
  referent: { name: string }
  contact: { id: string; firstName: string; lastName: string } | null
  candidates: MissionCandidateEntity[]
}

export type MissionCandidateRow = {
  id: string
  fullName: string
  stageId: string
  stageName: string
  jobTitle: string | null
  city: string | null
  postalCode: string | null
  referentName: string | null
}

export type MissionFormSource = {
  title: string
  description: string | null
  contractType: ContractType
  startDate: Date
  endDate: Date | null
  salaireMin: number | null
  salaireMax: number | null
  salaireNotes: string | null
  heuresParSemaine: number | null
  planning: string | null
  tempsPlein: boolean
  notes: string | null
  pharmacyId: string
  contactId: string | null
  referentId: string
  jobTitleId: string
}

export type MissionDetailPayload = {
  id: string
  status: MissionStatus
  pharmacyName: string
  city: string | null
  jobTitleName: string
  referentName: string
  updatedAt: Date
  formSource: MissionFormSource
  candidates: MissionCandidateRow[]
}
