import type { InterviewMode, Prisma, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

const copySelect = { profileKey: true, mode: true, label: true, sections: true } as const

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
  }
}

export const interviewTemplateWorkingCopyRepository =
  makeInterviewTemplateWorkingCopyRepository()
