import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import type { SmsDueRow, AvailabilitySmsContact } from '@/server/weekly-availability/sms-due.types'

export type { AvailabilitySmsContact }

export function makeWeeklyAvailabilitySmsRepository(db: PrismaClient) {
  return {
    listDue: async (): Promise<SmsDueRow[]> => {
      const rows = await db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          origin: 'APP',
          status: { not: 'INACTIF' },
          OR: [
            { weeklyAvailabilityToken: null },
            { weeklyAvailabilityToken: { smsSentAt: null } },
          ],
        },
        select: { id: true, firstName: true, phone: true },
      })
      return rows.map((row) => ({
        candidateId: row.id,
        firstName: row.firstName,
        phone: row.phone,
      }))
    },
    markSent: async (candidateId: string) => {
      await db.weeklyAvailabilityToken.update({
        where: { candidateId },
        data: { smsSentAt: new Date() },
      })
    },
    findContact: async (candidateId: string): Promise<AvailabilitySmsContact | null> => {
      const row = await db.candidate.findFirst({
        where: { id: candidateId, ...NOT_DELETED },
        select: { origin: true, firstName: true, phone: true },
      })
      return row
    },
  }
}
