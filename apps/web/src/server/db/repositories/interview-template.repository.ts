import type { InterviewMode, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeInterviewTemplateRepository(db: PrismaClient = defaultDb) {
  return {
    findByProfileMode: (profileKey: string, mode: InterviewMode) =>
      db.interviewTemplate.findFirst({
        where: { profileKey, mode },
        orderBy: { version: 'desc' },
        select: { label: true, sections: true },
      }),
  }
}

export const interviewTemplateRepository = makeInterviewTemplateRepository()
