import type { Prisma, PrismaClient } from '@prisma/client'
import type { PharmacyUpdate } from '@/view-models/pharmacy-update'
import { assertMergePharmaciesValid } from '@/server/pharmacy/validate-merge-pharmacies'

type Tx = Prisma.TransactionClient

async function transferRelations(tx: Tx, keptId: string, absorbedId: string) {
  await tx.contact.updateMany({ where: { pharmacyId: absorbedId }, data: { pharmacyId: keptId } })
  await tx.mission.updateMany({ where: { pharmacyId: absorbedId }, data: { pharmacyId: keptId } })
  await tx.activityLog.updateMany({ where: { pharmacyId: absorbedId }, data: { pharmacyId: keptId } })
  await tx.document.updateMany({ where: { pharmacyId: absorbedId }, data: { pharmacyId: keptId } })
}

export function makePharmacyMergeRepository(db: PrismaClient) {
  return {
    merge: async (keptId: string, absorbedId: string | undefined, data: PharmacyUpdate) => {
      await db.$transaction(async (tx) => {
        await assertMergePharmaciesValid(tx, keptId, absorbedId)
        if (absorbedId) {
          await transferRelations(tx, keptId, absorbedId)
          await tx.pharmacy.update({
            where: { id: absorbedId },
            data: { deletedAt: new Date(), siret: null },
          })
        }
        await tx.pharmacy.update({
          where: { id: keptId },
          data: { ...data, deletedAt: null },
        })
      })
      return { id: keptId }
    },
  }
}
