import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@prisma/client'
import type { PharmacyScrapeMappedRow } from '@/view-models/pharmacy-scrape-normalize'

const CHUNK = 200

function sqlLiteral(value: string | null): string {
  if (value == null) return 'NULL'
  return `'${value.replace(/'/g, "''")}'`
}

function valuesSql(row: PharmacyScrapeMappedRow): string {
  return `(${sqlLiteral(randomUUID())}, ${sqlLiteral(row.provenance)}, ${sqlLiteral(row.email)}, ${sqlLiteral(row.name)}, ${sqlLiteral(row.department)}, ${sqlLiteral(row.city)}, ${sqlLiteral(row.scrapedAt.toISOString())}::timestamptz, NULL, NOW(), NOW())`
}

export async function upsertPharmacyScrapeBatch(
  db: PrismaClient,
  rows: PharmacyScrapeMappedRow[],
): Promise<{ created: number; updated: number }> {
  let created = 0
  let updated = 0
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK)
    if (chunk.length === 0) continue
    const existing = await db.pharmacyScrape.findMany({
      where: {
        OR: chunk.map((r) => ({ email: r.email, provenance: r.provenance })),
      },
      select: { email: true, provenance: true },
    })
    const existingKeys = new Set(existing.map((e) => `${e.email}\0${e.provenance}`))
    for (const r of chunk) {
      if (existingKeys.has(`${r.email}\0${r.provenance}`)) updated += 1
      else created += 1
    }
    await db.$executeRawUnsafe(`
      INSERT INTO "PharmacyScrape" ("id", "provenance", "email", "name", "department", "city", "scrapedAt", "deletedAt", "createdAt", "updatedAt")
      VALUES ${chunk.map(valuesSql).join(',\n')}
      ON CONFLICT ("email", "provenance") DO UPDATE SET
        "name" = EXCLUDED."name",
        "department" = EXCLUDED."department",
        "city" = EXCLUDED."city",
        "scrapedAt" = EXCLUDED."scrapedAt",
        "deletedAt" = NULL,
        "updatedAt" = NOW()
    `)
  }
  return { created, updated }
}
