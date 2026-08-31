import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'

export type AppOriginCreateInput = {
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  postalCode: string | null
  jobTitleId: string
  origin: 'APP'
  status: 'NOUVEAU'
  badakanId: string
}

export function makeCandidateAppOriginRepository(db: PrismaClient) {
  return {
    findByBadakanId: (badakanId: string) =>
      db.candidate.findFirst({
        where: { badakanId, ...NOT_DELETED },
        select: { id: true },
      }),
    createAppCandidate: (data: AppOriginCreateInput) =>
      db.candidate.create({
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          jobTitleId: data.jobTitleId,
          origin: 'APP',
          status: 'NOUVEAU',
          badakanId: data.badakanId,
        },
        select: { id: true },
      }),
    linkAppOrigin: (id: string, badakanId: string) =>
      db.candidate.update({
        where: { id },
        data: { origin: 'APP', badakanId },
        select: { id: true },
      }),
  }
}
