import type { ActivityType, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

type ListInput = {
  contactId?: string
  pharmacyId?: string
  types?: ActivityType[]
}

type CreateInput = ListInput & {
  authorId: string
  type: ActivityType
  content?: string
  date?: Date
}

const authorInclude = { author: { select: { name: true } } } as const

export function makeActivityLogRepository(db: PrismaClient = defaultDb) {
  return {
    list: (input: ListInput) =>
      db.activityLog.findMany({
        where: {
          ...(input.contactId
            ? { contactId: input.contactId, entityType: 'CONTACT' }
            : { pharmacyId: input.pharmacyId, entityType: 'PHARMACY' }),
          ...(input.types?.length ? { type: { in: input.types } } : {}),
        },
        include: authorInclude,
        orderBy: { date: 'desc' },
      }),
    create: (input: CreateInput) =>
      db.activityLog.create({
        data: {
          entityType: input.contactId ? 'CONTACT' : 'PHARMACY',
          contactId: input.contactId,
          pharmacyId: input.pharmacyId,
          authorId: input.authorId,
          type: input.type,
          content: input.content,
          date: input.date ?? new Date(),
        },
        include: authorInclude,
      }),
  }
}

export const activityLogRepository = makeActivityLogRepository()
