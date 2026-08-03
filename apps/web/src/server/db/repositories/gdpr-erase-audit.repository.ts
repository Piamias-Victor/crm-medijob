import type { DocumentEntityType, PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'

export function makeGdprEraseAuditRepository(db: PrismaClient = defaultDb) {
  return {
    create: (data: {
      entityType: DocumentEntityType
      entityId: string
      erasedByUserId: string
      reason?: string
    }) =>
      db.gdprEraseAudit.create({
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          erasedByUserId: data.erasedByUserId,
          reason: data.reason,
        },
      }),
  }
}

export const gdprEraseAuditRepository = makeGdprEraseAuditRepository()
