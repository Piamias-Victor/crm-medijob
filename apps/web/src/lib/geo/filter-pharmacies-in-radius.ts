import { isValidEmailRecipient } from '@/lib/mailto/is-valid-email-recipient'
import { resolvePharmacyOutreachEmail } from '@/lib/pharmacy/resolve-outreach-email'
import { haversineKm, type Coords, type GeoLookup } from '@/server/matching/distance'
import type { PharmacyRadiusSource } from '@/server/routers/candidate-list-in-radius'
import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'

export async function buildPostalCodeCoordMap(codes: string[], lookupPostal: GeoLookup) {
  const uniqueCodes = [...new Set(codes.map((code) => code.trim()).filter(Boolean))]
  const entries = await Promise.all(
    uniqueCodes.map(async (code) => [code, await lookupPostal(code)] as const),
  )
  return new Map(entries.filter((entry): entry is [string, Coords] => Boolean(entry[1])))
}

export async function filterPharmaciesByRadius(
  pharmacies: PharmacyRadiusSource[],
  center: Coords,
  radiusKm: number,
  lookupPostal: GeoLookup,
): Promise<PharmacyInRadiusRow[]> {
  const postalCodes = pharmacies
    .map((pharmacy) => pharmacy.postalCode?.trim())
    .filter((code): code is string => Boolean(code))
  const coordsByPostal = await buildPostalCodeCoordMap(postalCodes, lookupPostal)

  return pharmacies.flatMap((pharmacy) => {
    const postalCode = pharmacy.postalCode?.trim()
    if (!postalCode) return []

    const pharmacyCoords = coordsByPostal.get(postalCode)
    if (!pharmacyCoords) return []

    const distanceKm = haversineKm(center, pharmacyCoords)
    if (distanceKm > radiusKm) return []

    const primaryContact = pharmacy.contacts[0]
    const email = resolvePharmacyOutreachEmail({
      pharmacyEmail: pharmacy.email,
      primaryContactEmail: primaryContact?.email ?? null,
    })
    if (!email) return []

    const primaryEmail = primaryContact?.email?.trim() ?? ''
    const contactId =
      primaryEmail && email === primaryEmail && isValidEmailRecipient(primaryEmail)
        ? primaryContact.id
        : null

    return [
      {
        id: pharmacy.id,
        name: pharmacy.name,
        city: pharmacy.city,
        distanceKm: Math.round(distanceKm * 10) / 10,
        email,
        contactId,
      },
    ]
  })
}
