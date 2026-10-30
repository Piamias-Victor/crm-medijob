import type { PrismaClient } from '@prisma/client'
import { prisma as defaultDb } from './client'
import { NOT_DELETED } from './soft-delete'
import type { PharmacyScrapeMappedRow } from '@/view-models/pharmacy-scrape-normalize'
import type { PharmacyScrapeListFilters } from '@/view-models/pharmacy-scrape-list-filters'
import { PHARMACY_SCRAPE_LIST_LIMIT } from '@/lib/list-limits'
import { buildPharmacyScrapeListWhere } from './pharmacy-scrape-list-where'
import { upsertPharmacyScrapeBatch } from './pharmacy-scrape-upsert-batch'

export function makePharmacyScrapeRepository(db: PrismaClient = defaultDb) {
  const listDuplicateEmails = async () => {
    const grouped = await db.pharmacyScrape.groupBy({
      by: ['email'],
      where: NOT_DELETED,
      _count: { email: true },
      having: { email: { _count: { gt: 1 } } },
    })
    return grouped.map((g) => g.email)
  }

  return {
    upsertBatch: (rows: PharmacyScrapeMappedRow[]) => upsertPharmacyScrapeBatch(db, rows),
    listDuplicateEmails,
    softDelete: (ids: string[]) =>
      db.pharmacyScrape.updateMany({
        where: { id: { in: ids }, ...NOT_DELETED },
        data: { deletedAt: new Date() },
      }),
    async list(filters: PharmacyScrapeListFilters = {}) {
      const duplicateEmails = filters.duplicatesOnly ? await listDuplicateEmails() : []
      return db.pharmacyScrape.findMany({
        where: buildPharmacyScrapeListWhere(filters, duplicateEmails),
        orderBy: [{ name: 'asc' }, { email: 'asc' }],
        take: PHARMACY_SCRAPE_LIST_LIMIT,
      })
    },
    listProvenances: () =>
      db.pharmacyScrape.findMany({
        where: NOT_DELETED,
        distinct: ['provenance'],
        select: { provenance: true },
        orderBy: { provenance: 'asc' },
      }),
    listDepartments: () =>
      db.pharmacyScrape.findMany({
        where: { ...NOT_DELETED, department: { not: null } },
        distinct: ['department'],
        select: { department: true },
        orderBy: { department: 'asc' },
      }),
  }
}

export const pharmacyScrapeRepository = makePharmacyScrapeRepository()
