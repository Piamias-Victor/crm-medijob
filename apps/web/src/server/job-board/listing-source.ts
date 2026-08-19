import type { ContractType } from '@prisma/client'

export type ListingSource = {
  title: string
  content: string
  boardListingId: string | null
  contactEmail: string
  mission: {
    contractType: ContractType
    tempsPlein: boolean
    salaireMin: number | null
    salaireMax: number | null
    startDate: Date
    profilRecherche: string | null
    jobTitleName: string
  }
  pharmacy: {
    name: string
    city: string | null
    postalCode: string | null
    latitude: number | null
    longitude: number | null
  }
}
