import { geocodeAddressFields, type GeoQueryLookup } from '@/lib/geo/geocode-address-fields'
import { toBoardListing } from '@/server/job-board/listing-map'
import type { ListingSource } from '@/server/job-board/listing-source'
import type { OfferLifecycleRow } from '@/server/routers/job-offer-lifecycle'

export type MissionForListing = {
  contractType: ListingSource['mission']['contractType']
  tempsPlein: boolean
  salaireMin: number | null
  salaireMax: number | null
  startDate: Date
  profilRecherche: string | null
  jobTitle: { name: string }
  pharmacy: ListingSource['pharmacy'] & { address: string | null }
}

async function resolveCoords(pharmacy: MissionForListing['pharmacy'], lookup: GeoQueryLookup) {
  if (pharmacy.latitude != null && pharmacy.longitude != null) {
    return { latitude: pharmacy.latitude, longitude: pharmacy.longitude }
  }
  const coords = await geocodeAddressFields(
    { address: pharmacy.address, city: pharmacy.city, postalCode: pharmacy.postalCode },
    lookup,
  )
  return { latitude: coords?.latitude ?? null, longitude: coords?.longitude ?? null }
}

export async function buildListingForOffer(
  offer: OfferLifecycleRow,
  mission: MissionForListing,
  contactEmail: string,
  lookup: GeoQueryLookup,
) {
  const coords = await resolveCoords(mission.pharmacy, lookup)
  return toBoardListing({
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
      jobTitleName: mission.jobTitle.name,
    },
    pharmacy: {
      name: mission.pharmacy.name,
      city: mission.pharmacy.city,
      postalCode: mission.pharmacy.postalCode,
      latitude: coords.latitude,
      longitude: coords.longitude,
    },
  })
}
