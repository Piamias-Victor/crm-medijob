import type { ActivityType, DocumentEntityType, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { activityEntityData, activityEntityFilter } from './entity-scope'

type ListByEntityInput = {
  entityType: DocumentEntityType
  entityId: string
  types?: ActivityType[]
}

type CreateInput = ListByEntityInput & {
  authorId: string
  type: ActivityType
  content?: string
  date?: Date
}

const authorInclude = { author: { select: { name: true } } } as const

export function makeActivityLogRepository(db: PrismaClient = defaultDb) {
  return {
    listByEntity: (input: ListByEntityInput, limit = DEFAULT_LIST_LIMIT) =>
      db.activityLog.findMany({
        where: {
          ...activityEntityFilter(input.entityType, input.entityId),
          ...(input.types?.length ? { type: { in: input.types } } : {}),
        },
        include: authorInclude,
        orderBy: { date: 'desc' },
        take: limit,
      }),
    create: (input: CreateInput) =>
      db.activityLog.create({
        data: {
          ...activityEntityData(input.entityType, input.entityId),
          authorId: input.authorId,
          type: input.type,
          content: input.content,
          date: input.date ?? new Date(),
        },
        include: authorInclude,
      }),
    createBatch: (inputs: CreateInput[]) =>
      db.$transaction(
        inputs.map((input) =>
          db.activityLog.create({
            data: {
              ...activityEntityData(input.entityType, input.entityId),
              authorId: input.authorId,
              type: input.type,
              content: input.content,
              date: input.date ?? new Date(),
            },
            include: authorInclude,
          }),
        ),
      ),
  }
}

export const activityLogRepository = makeActivityLogRepository()
