import type { DocumentEntityType, Prisma, PrismaClient } from '@prisma/client'
import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { prisma as defaultDb } from './client'
import { entityFilter } from './entity-scope'

export function makeDocumentRepository(db: PrismaClient = defaultDb) {
  return {
    listByEntity: (entityType: DocumentEntityType, entityId: string, limit = DEFAULT_LIST_LIMIT) =>
      db.document.findMany({
        where: entityFilter(entityType, entityId),
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    create: (data: Prisma.DocumentUncheckedCreateInput) => db.document.create({ data }),
    findById: (id: string) => db.document.findUnique({ where: { id } }),
    deleteById: async (id: string) => {
      const doc = await db.document.findUnique({ where: { id } })
      if (!doc) return null
      await db.document.delete({ where: { id } })
      return doc
    },
  }
}

export const documentRepository = makeDocumentRepository()
