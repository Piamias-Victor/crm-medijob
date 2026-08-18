import type { InterviewMode, Prisma, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

const pairSelect = { profileKey: true, mode: true, version: true, label: true } as const

export function makeInterviewTemplateRepository(db: PrismaClient = defaultDb) {
  return {
    findByProfileMode: (profileKey: string, mode: InterviewMode) =>
      db.interviewTemplate.findFirst({
        where: { profileKey, mode },
        orderBy: { version: 'desc' },
        select: { id: true, label: true, sections: true },
      }),
    findById: (id: string) =>
      db.interviewTemplate.findUnique({
        where: { id },
        select: { id: true, label: true, sections: true },
      }),
    listLatestPairs: () =>
      db.interviewTemplate.findMany({
        distinct: ['profileKey', 'mode'],
        orderBy: [{ profileKey: 'asc' }, { mode: 'asc' }, { version: 'desc' }],
        select: pairSelect,
      }),
    findLatestRow: (profileKey: string, mode: InterviewMode) =>
      db.interviewTemplate.findFirst({
        where: { profileKey, mode },
        orderBy: { version: 'desc' },
        select: { ...pairSelect, sections: true },
      }),
    createVersion: (data: {
      profileKey: string
      mode: InterviewMode
      version: number
      label: string
      sections: Prisma.InputJsonValue
    }) => db.interviewTemplate.create({ data, select: pairSelect }),
  }
}

export const interviewTemplateRepository = makeInterviewTemplateRepository()
