import { availabilitySmsReminderCutoff } from '@/view-models/weekly-availability-sms'
import type { CandidateStatus, PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import type {
  SmsDueKind,
  SmsDueRow,
  AvailabilitySmsContact,
} from '@/server/weekly-availability/sms-due.types'

export type { AvailabilitySmsContact }

const dueSelect = { id: true, firstName: true, phone: true } as const
const smsExcludedStatus: CandidateStatus[] = ['INACTIF', 'BLACKLISTE']

function validatedAppWhere() {
  return {
    ...NOT_DELETED,
    origin: 'APP' as const,
    status: { notIn: smsExcludedStatus },
    badakanValidatedAt: { not: null },
  }
}

function toDueRow(
  row: { id: string; firstName: string; phone: string | null },
  kind: SmsDueKind,
): SmsDueRow {
  return { candidateId: row.id, firstName: row.firstName, phone: row.phone, kind }
}

export function makeWeeklyAvailabilitySmsRepository(db: PrismaClient) {
  return {
    listDue: async (): Promise<SmsDueRow[]> => {
      const rows = await db.candidate.findMany({
        where: {
          ...validatedAppWhere(),
          OR: [
            { weeklyAvailabilityToken: null },
            { weeklyAvailabilityToken: { smsSentAt: null } },
          ],
        },
        select: dueSelect,
      })
      return rows.map((row) => toDueRow(row, 'first'))
    },
    listReminderDue: async (now: Date = new Date()): Promise<SmsDueRow[]> => {
      const rows = await db.candidate.findMany({
        where: {
          ...validatedAppWhere(),
          weeklyAvailabilityToken: {
            smsSentAt: { lte: availabilitySmsReminderCutoff(now) },
          },
        },
        select: dueSelect,
      })
      return rows.map((row) => toDueRow(row, 'reminder'))
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
        select: { origin: true, status: true, firstName: true, phone: true },
      })
      return row
    },
  }
}
