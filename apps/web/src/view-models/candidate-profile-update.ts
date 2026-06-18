import type { ContractType } from '@prisma/client'

export type CandidateProfileUpdate = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  city?: string
  postalCode?: string
  jobTitleId: string
  mobilityRadiusKm: number
  mobilityNotes?: string
  availableFrom?: Date | null
  notes?: string
  referentId: string
  softwareIds: string[]
  contractTypes: ContractType[]
}
