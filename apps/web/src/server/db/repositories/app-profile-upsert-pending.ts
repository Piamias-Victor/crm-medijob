import type { PrismaClient } from '@prisma/client'
import type { AppProfileUpsertInput } from './app-profile.repository.types'
import { defaultRelanceOnArrival } from '@/view-models/app-profile-relance'

const MUTE_ERROR = 'syncro_import_muted'

export function upsertPendingAppProfile(db: PrismaClient, data: AppProfileUpsertInput) {
  const { muteOutbound, ...fields } = data
  const relanceAt = fields.relanceAt ?? defaultRelanceOnArrival(new Date())
  const mutedAt = muteOutbound ? new Date() : undefined
  return db.appProfile.upsert({
    where: { badakanId: fields.badakanId },
    create: {
      ...fields,
      status: 'EN_ATTENTE',
      syncedAt: new Date(),
      relanceAt,
      ...(mutedAt
        ? {
            inviteEmailSentAt: mutedAt,
            calendarSmsSentAt: mutedAt,
            inviteLastError: MUTE_ERROR,
          }
        : {}),
    },
    update: {
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      phone: fields.phone,
      address: fields.address,
      city: fields.city,
      postalCode: fields.postalCode,
      activityLabel: fields.activityLabel,
      jobTitleId: fields.jobTitleId,
      hasResume: fields.hasResume ?? false,
      snapshot: fields.snapshot,
      syncedAt: new Date(),
      ...(mutedAt
        ? {
            inviteEmailSentAt: mutedAt,
            calendarSmsSentAt: mutedAt,
            inviteLastError: MUTE_ERROR,
          }
        : {}),
    },
  })
}
