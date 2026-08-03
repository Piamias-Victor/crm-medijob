import type { Coords } from '@/lib/geo/coords'

export type AddressFields = {
  address: string | null
  city: string | null
  postalCode: string | null
}

export type LatLng = {
  latitude: number
  longitude: number
}

export type GeoQueryLookup = (query: string) => Promise<Coords | null>

function trimOrEmpty(value: string | null | undefined) {
  return value?.trim() ?? ''
}

export function buildGeocodeQuery(fields: AddressFields): string | null {
  const parts = [fields.address, fields.postalCode, fields.city]
    .map(trimOrEmpty)
    .filter(Boolean)
  return parts.length ? parts.join(' ') : null
}

export async function geocodeAddressFields(
  fields: AddressFields,
  lookup: GeoQueryLookup,
): Promise<LatLng | null> {
  const query = buildGeocodeQuery(fields)
  if (!query) return null
  const coords = await lookup(query)
  if (!coords) return null
  return { latitude: coords.lat, longitude: coords.lon }
}

export function addressFieldsChanged(prev: AddressFields, next: AddressFields) {
  return (
    trimOrEmpty(prev.address) !== trimOrEmpty(next.address) ||
    trimOrEmpty(prev.city) !== trimOrEmpty(next.city) ||
    trimOrEmpty(prev.postalCode) !== trimOrEmpty(next.postalCode)
  )
}
