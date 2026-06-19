import type { ActivityType, DocumentEntityType, Prisma, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

const authorSelect = { select: { name: true } } as const

type EntityQuery = {
  entityType: DocumentEntityType
  entityId: string
  type?: ActivityType
}

type CreateInput = EntityQuery & {
  authorId: string
  type: ActivityType
  content?: string
  date: Date
}

const entityField: Record<DocumentEntityType, keyof Prisma.ActivityLogWhereInput> = {
  CANDIDATE: 'candidateId',
  PHARMACY: 'pharmacyId',
  CONTACT: 'contactId',
  MISSION: 'missionId',
}

function entityWhere({ entityType, entityId, type }: EntityQuery): Prisma.ActivityLogWhereInput {
  return {
    entityType,
    [entityField[entityType]]: entityId,
    ...(type ? { type } : {}),
  }
}

function entityData({ entityType, entityId }: EntityQuery) {
  return {
    entityType,
    candidateId: entityType === 'CANDIDATE' ? entityId : null,
    pharmacyId: entityType === 'PHARMACY' ? entityId : null,
    contactId: entityType === 'CONTACT' ? entityId : null,
    missionId: entityType === 'MISSION' ? entityId : null,
  }
}

export function makeActivityLogRepository(db: PrismaClient = defaultDb) {
  return {
    listByEntity: (query: EntityQuery) =>
      db.activityLog.findMany({
        where: entityWhere(query),
        include: { author: authorSelect },
        orderBy: { date: 'desc' },
      }),
    create: (input: CreateInput) =>
      db.activityLog.create({
        data: {
          ...entityData(input),
          authorId: input.authorId,
          type: input.type,
          content: input.content,
          date: input.date,
        },
        include: { author: authorSelect },
      }),
  }
}

export const activityLogRepository = makeActivityLogRepository()
