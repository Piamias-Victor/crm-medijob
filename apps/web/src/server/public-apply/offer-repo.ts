import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'
import { toPublicOfferCard } from '@/server/public-apply/offer-card'

const offerSelect = {
  id: true,
  boardListingId: true,
  title: true,
  status: true,
  city: true,
  jobTitleName: true,
  jobTitleId: true,
  contractType: true,
  jobTitle: { select: { id: true, name: true } },
  mission: {
    select: {
      contractType: true,
      jobTitle: { select: { id: true, name: true } },
      pharmacy: { select: { city: true } },
    },
  },
} as const

export function makePublicApplyOfferRepo(db: PrismaClient) {
  return {
    async findByBoardListingId(boardListingId: string) {
      const row = await db.jobOffer.findFirst({
        where: { boardListingId, ...NOT_DELETED },
        select: offerSelect,
      })
      return row ? toPublicOfferCard(row) : null
    },
  }
}
