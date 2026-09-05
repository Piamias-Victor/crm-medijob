import type { BadakanMissionRaw } from './map-mission.schema'

export type BadakanMissionDetails = {
  identifier: string | null
  activityId: string | null
  activityLabel: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  latitude: number | null
  longitude: number | null
  softwareLabel: string | null
  contactName: string | null
  contactPhone: string | null
  hourlyRate: number | null
  reasonLabel: string | null
  expectedRecipients: number
  staffedRecipients: number
}

export const EMPTY_BADAKAN_MISSION_DETAILS: BadakanMissionDetails = {
  identifier: null,
  activityId: null,
  activityLabel: null,
  address: null,
  city: null,
  postalCode: null,
  latitude: null,
  longitude: null,
  softwareLabel: null,
  contactName: null,
  contactPhone: null,
  hourlyRate: null,
  reasonLabel: null,
  expectedRecipients: 0,
  staffedRecipients: 0,
}

function text(value: string | null | undefined): string | null {
  return value?.trim() || null
}

function contactName(raw: BadakanMissionRaw): string | null {
  const contact = raw.contact
  if (!contact) return null
  return text([contact.firstName, contact.lastName].filter(Boolean).join(' '))
}

export function mapBadakanMissionDetails(raw: BadakanMissionRaw): BadakanMissionDetails {
  const address = raw.enterprise?.address
  const [longitude, latitude] = address?.location?.coordinates ?? []
  return {
    identifier: text(raw.identifier),
    activityId: raw.activity?.id ?? null,
    activityLabel: text(raw.activity?.label),
    address: text(address?.address1),
    city: text(address?.city),
    postalCode: text(address?.zipCode),
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    softwareLabel: text(raw.instruction),
    contactName: contactName(raw),
    contactPhone: text(raw.contact?.phone),
    hourlyRate: raw.hourlyRateWithoutTaxes ?? raw.grade?.hourlyRate ?? null,
    reasonLabel: text(raw.reason),
    expectedRecipients: raw.expectedNumberOfRecipients ?? 0,
    staffedRecipients: raw.staffedNumberOfRecipients ?? 0,
  }
}
