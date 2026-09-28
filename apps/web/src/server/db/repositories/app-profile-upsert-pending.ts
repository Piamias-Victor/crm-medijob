import type { PrismaClient } from '@prisma/client'
import type { AppProfileUpsertInput } from './app-profile.repository.types'
import { defaultRelanceOnArrival } from '@/view-models/app-profile-relance'

export function upsertPendingAppProfile(db: PrismaClient, data: AppProfileUpsertInput) {
  const relanceAt = data.relanceAt ?? defaultRelanceOnArrival(new Date())
  return db.appProfile.upsert({
    where: { badakanId: data.badakanId },
    create: { ...data, status: 'EN_ATTENTE', syncedAt: new Date(), relanceAt },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      activityLabel: data.activityLabel,
      jobTitleId: data.jobTitleId,
      hasResume: data.hasResume ?? false,
      snapshot: data.snapshot,
      syncedAt: new Date(),
    },
  })
}
