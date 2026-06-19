import type { ActivityType, DocumentEntityType, Prisma, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

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

function entityFilter(
  entityType: DocumentEntityType,
  entityId: string,
): Prisma.ActivityLogWhereInput {
  switch (entityType) {
    case 'PHARMACY':
      return { pharmacyId: entityId, entityType }
    case 'CONTACT':
      return { contactId: entityId, entityType }
    case 'MISSION':
      return { missionId: entityId, entityType }
    case 'CANDIDATE':
      return { candidateId: entityId, entityType }
  }
}

function entityData(
  entityType: DocumentEntityType,
  entityId: string,
): Pick<
  Prisma.ActivityLogUncheckedCreateInput,
  'entityType' | 'candidateId' | 'pharmacyId' | 'contactId' | 'missionId'
> {
  switch (entityType) {
    case 'PHARMACY':
      return { entityType, pharmacyId: entityId }
    case 'CONTACT':
      return { entityType, contactId: entityId }
    case 'MISSION':
      return { entityType, missionId: entityId }
    case 'CANDIDATE':
      return { entityType, candidateId: entityId }
  }
}

export function makeActivityLogRepository(db: PrismaClient = defaultDb) {
  return {
    listByEntity: (input: ListByEntityInput) =>
      db.activityLog.findMany({
        where: {
          ...entityFilter(input.entityType, input.entityId),
          ...(input.types?.length ? { type: { in: input.types } } : {}),
        },
        include: authorInclude,
        orderBy: { date: 'desc' },
      }),
    create: (input: CreateInput) =>
      db.activityLog.create({
        data: {
          ...entityData(input.entityType, input.entityId),
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
