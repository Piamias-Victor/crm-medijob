import type { Prisma } from '@prisma/client'
import type { BadakanMissionToPersist } from '@/server/badakan-mission/sync'

export const includeApplied = { searchApplied: true } as const
export const includeReferentials = {
  jobTitle: { select: { name: true } },
  software: { select: { name: true } },
} as const

export function persistFields(data: BadakanMissionToPersist) {
  return {
    badakanId: data.badakanId,
    identifier: data.identifier,
    pharmacyName: data.pharmacyName,
    enterpriseId: data.enterpriseId,
    step: data.step,
    periods: data.periods as Prisma.InputJsonValue,
    activityId: data.activityId,
    activityLabel: data.activityLabel,
    softwareId: data.softwareId,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode,
    latitude: data.latitude,
    longitude: data.longitude,
    softwareLabel: data.softwareLabel,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    hourlyRate: data.hourlyRate,
    reasonLabel: data.reasonLabel,
    expectedRecipients: data.expectedRecipients,
    staffedRecipients: data.staffedRecipients,
    syncedAt: new Date(),
  }
}
