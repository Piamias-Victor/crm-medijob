import type { ContractType, MissionStatus } from '@prisma/client'

export type RawCandidateExport = {
  id?: string
  firstName?: string
  lastName?: string
  email?: string | null
  phone?: string | null
  address?: string | null
  city?: string | null
  postalCode?: string | null
  mobilityRadiusKm?: number | null
  mobilityNotes?: string | null
  availableFrom?: Date | null
  notes?: string | null
  cvSummary?: string | null
  anonymizedProfile?: string | null
  createdAt?: Date
  updatedAt?: Date
  jobTitle?: { name: string } | null
  referent?: { name: string } | null
  softwares?: { software: { name: string } }[]
  contractPreferences?: { contractType: ContractType }[]
  missions?: {
    mission: { title: string; status: MissionStatus }
    stage: { name: string }
  }[]
}
