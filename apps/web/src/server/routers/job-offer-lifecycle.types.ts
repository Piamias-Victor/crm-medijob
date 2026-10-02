import type { ContractType, JobOfferStatus } from '@prisma/client'

export type OfferLifecycleRow = {
  id: string
  missionId: string | null
  status: JobOfferStatus
  title: string
  content: string
  boardListingId: string | null
  jobTitleName: string | null
  city: string | null
  postalCode: string | null
  latitude: number | null
  longitude: number | null
  contractType: ContractType | null
  tempsPlein: boolean | null
  salaireMin: number | null
  salaireMax: number | null
  startDate: Date | null
  profilRecherche: string | null
}
