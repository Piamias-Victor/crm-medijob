import type { ContractType } from '@prisma/client'
import type { ManualCandidateStatus } from '@/view-models/candidate-status'

export type CandidateProfileUpdate = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  jobTitleId: string
  status?: ManualCandidateStatus
  salaryExpectations?: string
  salaryMin?: number | null
  salaryMax?: number | null
  mobilityRadiusKm: number
  mobilityNotes?: string
  availableFrom?: Date | null
  notes?: string
  referentId?: string | null
  softwareIds: string[]
  contractTypes: ContractType[]
  cvUrl?: string
}
