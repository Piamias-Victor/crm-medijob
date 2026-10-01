import type { ContractType } from '@prisma/client'
import type { ListingSource } from '@/server/job-board/listing-source'

export type OfferPublishFields = {
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

export type MissionPublishFields = {
  contractType: ContractType
  tempsPlein: boolean
  salaireMin: number | null
  salaireMax: number | null
  startDate: Date
  profilRecherche: string | null
  jobTitleName: string
  pharmacy: {
    name: string
    city: string | null
    postalCode: string | null
    latitude: number | null
    longitude: number | null
  }
}

export function resolveListingSource(
  offer: OfferPublishFields,
  mission: MissionPublishFields | null,
  contactEmail: string,
): ListingSource {
  if (mission) {
    return {
      title: offer.title,
      content: offer.content,
      boardListingId: offer.boardListingId,
      contactEmail,
      mission: {
        contractType: mission.contractType,
        tempsPlein: mission.tempsPlein,
        salaireMin: mission.salaireMin,
        salaireMax: mission.salaireMax,
        startDate: mission.startDate,
        profilRecherche: mission.profilRecherche,
        jobTitleName: mission.jobTitleName,
      },
      pharmacy: mission.pharmacy,
    }
  }
  if (!offer.jobTitleName || !offer.contractType) {
    throw new Error('STANDALONE_OFFER_INCOMPLETE')
  }
  return {
    title: offer.title,
    content: offer.content,
    boardListingId: offer.boardListingId,
    contactEmail,
    mission: {
      contractType: offer.contractType,
      tempsPlein: offer.tempsPlein ?? true,
      salaireMin: offer.salaireMin,
      salaireMax: offer.salaireMax,
      startDate: offer.startDate ?? new Date(),
      profilRecherche: offer.profilRecherche,
      jobTitleName: offer.jobTitleName,
    },
    pharmacy: {
      name: 'MEDIJOB',
      city: offer.city,
      postalCode: offer.postalCode,
      latitude: offer.latitude,
      longitude: offer.longitude,
    },
  }
}
