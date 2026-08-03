/**
 * Reseed users only (no demo data). Safe to run against preview/prod Neon.
 *
 *   cd apps/web && npx tsx prisma/seed-users-only.ts
 */
import { PrismaClient } from '@prisma/client'
import { listSeedUsers, seedUsers } from './seed-users'

const prisma = new PrismaClient()

async function main() {
  await seedUsers(prisma)
  const emails = listSeedUsers().map((u) => `${u.email} (${u.role})`)
  console.log(`Seeded ${emails.length} users:`)
  for (const line of emails) console.log(`  - ${line}`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
