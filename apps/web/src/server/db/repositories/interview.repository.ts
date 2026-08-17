import type { InterviewDecision, InterviewMode, InterviewStatus, Prisma, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'

export type InterviewCreateInput = {
  candidateId: string
  mode: InterviewMode
  referentId?: string | null
  status?: InterviewStatus
  decision?: InterviewDecision | null
  answers?: Prisma.InputJsonValue
  scores?: Prisma.InputJsonValue
}

export function makeInterviewRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: InterviewCreateInput) =>
      db.interview.create({
        data: {
          candidateId: data.candidateId,
          mode: data.mode,
          referentId: data.referentId ?? undefined,
          status: data.status,
          decision: data.decision,
          answers: data.answers ?? undefined,
          scores: data.scores ?? undefined,
        },
      }),
    findById: (id: string) => db.interview.findFirst({ where: { id, ...NOT_DELETED } }),
    listByCandidate: (candidateId: string, limit = DEFAULT_LIST_LIMIT) =>
      db.interview.findMany({
        where: { candidateId, ...NOT_DELETED },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
  }
}

export const interviewRepository = makeInterviewRepository()
