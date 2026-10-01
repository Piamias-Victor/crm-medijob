import { geocodeAddressFields, type GeoQueryLookup } from '@/lib/geo/geocode-address-fields'
import { toBoardListing } from '@/server/job-board/listing-map'
import {
  resolveListingSource,
  type MissionPublishFields,
  type OfferPublishFields,
} from '@/server/job-board/resolve-listing-source'

export type MissionForListing = MissionPublishFields & {
  jobTitle: { name: string }
  pharmacy: MissionPublishFields['pharmacy'] & { address: string | null }
}

export type OfferForListing = OfferPublishFields & { id: string; missionId: string | null }

async function resolveCoords(
  pharmacy: { address: string | null; city: string | null; postalCode: string | null; latitude: number | null; longitude: number | null },
  lookup: GeoQueryLookup,
) {
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
  offer: OfferForListing,
  mission: MissionForListing | null,
  contactEmail: string,
  lookup: GeoQueryLookup,
) {
  if (mission) {
    const coords = await resolveCoords(mission.pharmacy, lookup)
    const source = resolveListingSource(
      offer,
      {
        ...mission,
        jobTitleName: mission.jobTitle.name,
        pharmacy: { ...mission.pharmacy, ...coords },
      },
      contactEmail,
    )
    return toBoardListing(source)
  }
  const pharmacy = {
    address: null,
    city: offer.city,
    postalCode: offer.postalCode,
    latitude: offer.latitude,
    longitude: offer.longitude,
  }
  const coords = await resolveCoords(pharmacy, lookup)
  const source = resolveListingSource(
    { ...offer, ...coords },
    null,
    contactEmail,
  )
  return toBoardListing(source)
}
