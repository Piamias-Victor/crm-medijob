import type { PrismaClient } from '@prisma/client'
import type { PharmacyApplyEmailDueRow } from '@/server/pharmacy-apply-email/send-due.types'
import { attachPharmacyApplyRecipients } from './pharmacy-apply-email.attach'

function sentKey(missionBadakanId: string, recipientId: string) {
  return `${missionBadakanId}:${recipientId}`
}

export function makePharmacyApplyEmailRepository(db: PrismaClient) {
  return {
    listDue: async (): Promise<PharmacyApplyEmailDueRow[]> => {
      const applied = await db.badakanSearchApplied.findMany({
        select: {
          recipientId: true,
          mission: { select: { badakanId: true, enterpriseId: true } },
        },
      })
      const sent = await db.badakanPharmacyApplyEmail.findMany({
        select: { missionBadakanId: true, recipientId: true },
      })
      const logged = new Set(
        sent.map((row) => sentKey(row.missionBadakanId, row.recipientId)),
      )
      const pending = applied.filter(
        (row) => !logged.has(sentKey(row.mission.badakanId, row.recipientId)),
      )
      if (pending.length === 0) return []
      return attachPharmacyApplyRecipients(db, pending)
    },
    markSent: async (missionBadakanId: string, recipientId: string) => {
      await db.badakanPharmacyApplyEmail.upsert({
        where: { missionBadakanId_recipientId: { missionBadakanId, recipientId } },
        create: { missionBadakanId, recipientId },
        update: { sentAt: new Date() },
      })
    },
  }
}
