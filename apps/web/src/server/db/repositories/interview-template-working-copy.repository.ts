import type { InterviewMode, Prisma, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

const copySelect = {
  profileKey: true,
  mode: true,
  label: true,
  sections: true,
  archivedAt: true,
} as const

export function makeInterviewTemplateWorkingCopyRepository(db: PrismaClient = defaultDb) {
  return {
    find: (profileKey: string, mode: InterviewMode) =>
      db.interviewTemplateWorkingCopy.findUnique({
        where: { profileKey_mode: { profileKey, mode } },
        select: copySelect,
      }),
    upsert: (data: {
      profileKey: string
      mode: InterviewMode
      label: string
      sections: Prisma.InputJsonValue
    }) =>
      db.interviewTemplateWorkingCopy.upsert({
        where: { profileKey_mode: { profileKey: data.profileKey, mode: data.mode } },
        create: data,
        update: { label: data.label, sections: data.sections },
        select: copySelect,
      }),
    setArchived: (profileKey: string, mode: InterviewMode, archivedAt: Date | null) =>
      db.interviewTemplateWorkingCopy.update({
        where: { profileKey_mode: { profileKey, mode } },
        data: { archivedAt },
        select: copySelect,
      }),
    list: () =>
      db.interviewTemplateWorkingCopy.findMany({
        select: { profileKey: true, mode: true, archivedAt: true },
      }),
  }
}

export const interviewTemplateWorkingCopyRepository =
  makeInterviewTemplateWorkingCopyRepository()
