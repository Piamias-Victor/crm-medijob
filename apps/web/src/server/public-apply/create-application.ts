import type { PrismaClient } from '@prisma/client'
import type { PublicApplySubmitDeps } from '@/server/public-apply/submit-types'

type Payload = Parameters<PublicApplySubmitDeps['createApplication']>[0]

export function createPublicApplyApplication(db: PrismaClient, data: Payload) {
  return db.application.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      city: data.city,
      postalCode: data.postalCode,
      message: data.message,
      cvUrl: data.cvUrl,
      consentGivenAt: data.consentGivenAt,
      consentSource: data.consentSource,
      source: 'PUBLIC_APPLY',
      status: 'EN_ATTENTE',
      jobOffer: { connect: { id: data.jobOfferId } },
      jobTitle: { connect: { id: data.jobTitleId } },
    },
    select: { id: true },
  })
}
