import type { PrismaClient } from '@prisma/client'
import { NOT_DELETED } from './soft-delete'
import { isOpenNeed } from '@/view-models/badakan-need'
import type { NeedSmsNeed, NeedSmsRow } from '@/server/interim-need-sms/match.types'

const candidateSelect = {
  id: true,
  jobTitleId: true,
  phone: true,
  latitude: true,
  longitude: true,
  postalCode: true,
  interimNeedSmsSentAt: true,
} as const

function toRow(row: {
  id: string
  jobTitleId: string
  phone: string | null
  latitude: number | null
  longitude: number | null
  postalCode: string | null
  interimNeedSmsSentAt: Date | null
}): NeedSmsRow {
  return {
    id: row.id,
    jobTitleId: row.jobTitleId,
    phone: row.phone,
    latitude: row.latitude,
    longitude: row.longitude,
    postalCode: row.postalCode,
    lastSentAt: row.interimNeedSmsSentAt,
  }
}

function toNeed(row: {
  jobTitleId: string | null
  createdAt: Date
  latitude: number | null
  longitude: number | null
  postalCode: string | null
}): NeedSmsNeed {
  return {
    jobTitleId: row.jobTitleId,
    createdAt: row.createdAt,
    latitude: row.latitude,
    longitude: row.longitude,
    postalCode: row.postalCode,
  }
}

export function makeInterimNeedSmsRepository(db: PrismaClient) {
  return {
    listCandidates: async (): Promise<NeedSmsRow[]> => {
      const rows = await db.candidate.findMany({
        where: {
          ...NOT_DELETED,
          origin: 'APP',
          status: { notIn: ['INACTIF', 'BLACKLISTE'] },
          badakanValidatedAt: { not: null },
        },
        select: candidateSelect,
      })
      return rows.map(toRow)
    },
    listOpenNeeds: async (): Promise<NeedSmsNeed[]> => {
      const rows = await db.badakanMission.findMany({
        where: {
          step: 'CREATED',
          jobTitleId: { not: null },
        },
        select: {
          jobTitleId: true,
          createdAt: true,
          latitude: true,
          longitude: true,
          postalCode: true,
          expectedRecipients: true,
          staffedRecipients: true,
        },
      })
      return rows.filter(isOpenNeed).map(toNeed)
    },
    markSent: (candidateId: string) =>
      db.candidate.update({
        where: { id: candidateId },
        data: { interimNeedSmsSentAt: new Date() },
        select: { id: true },
      }),
  }
}
