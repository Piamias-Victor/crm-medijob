import {
  addressFieldsChanged,
  buildGeocodeQuery,
  geocodeAddressFields,
  type AddressFields,
  type GeoQueryLookup,
  type LatLng,
} from '@/lib/geo/geocode-address-fields'

export type GeocodeWriteResult = LatLng | { latitude: null; longitude: null } | undefined

/** undefined = leave DB coords untouched (address unchanged). */
export async function resolveGeocodeForWrite(
  next: AddressFields,
  previous: AddressFields | null,
  lookup: GeoQueryLookup,
): Promise<GeocodeWriteResult> {
  if (previous && !addressFieldsChanged(previous, next)) return undefined
  if (!buildGeocodeQuery(next)) return { latitude: null, longitude: null }
  const coords = await geocodeAddressFields(next, lookup)
  return coords ?? { latitude: null, longitude: null }
}
