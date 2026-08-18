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
    findDraftByCandidate: (candidateId: string) =>
      db.interview.findFirst({
        where: { candidateId, status: 'DRAFT', ...NOT_DELETED },
        select: { id: true },
      }),
    listByCandidate: (candidateId: string, limit = DEFAULT_LIST_LIMIT) =>
      db.interview.findMany({
        where: { candidateId, ...NOT_DELETED },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    softDelete: async (id: string) => {
      const row = await db.interview.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: { candidateId: true },
      })
      return { candidateId: row.candidateId }
    },
    updateAnswers: async (id: string, answers: Prisma.InputJsonValue) => {
      await db.interview.update({ where: { id }, data: { answers } })
    },
    close: async (
      id: string,
      data: { scores: Prisma.InputJsonValue; decision: InterviewDecision },
    ) => {
      await db.interview.update({
        where: { id },
        data: { status: 'CLOSED', scores: data.scores, decision: data.decision },
      })
    },
  }
}

export const interviewRepository = makeInterviewRepository()
