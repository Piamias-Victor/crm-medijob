import type { ContractType, MissionStatus } from '@prisma/client'

export type MissionCandidateEntity = {
  candidateId: string
  candidate: { firstName: string; lastName: string }
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

export type MissionCandidateRow = { id: string; fullName: string }

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
