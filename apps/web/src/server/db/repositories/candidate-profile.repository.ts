import type { Prisma, ContractType } from '@prisma/client'

export const candidateProfileInclude = {
  jobTitle: { select: { id: true, name: true } },
  referent: { select: { id: true, name: true } },
  softwares: { select: { softwareId: true } },
  contractPreferences: { select: { contractType: true } },
  missions: {
    select: {
      stage: { select: { id: true, name: true, position: true } },
      mission: { select: { id: true, title: true, status: true } },
    },
    orderBy: { mission: { title: 'asc' as const } },
  },
} satisfies Prisma.CandidateInclude

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
