import type { ContractType, JobOfferStatus } from '@prisma/client'
import { z } from 'zod'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'

export const storedOfferSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
})

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

export function assertOfferReadyToPublish(title: string, content: string) {
  storedOfferSchema.parse({ title, content })
  return OFFER_SECTION_TITLES.every((section) => content.includes(section))
}
