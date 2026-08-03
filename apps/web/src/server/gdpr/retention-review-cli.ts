/**
 * CLI alert-only — liste candidats dus pour revue rétention.
 * Usage: pnpm exec tsx src/server/gdpr/retention-review-cli.ts
 */
import { prisma } from '@/server/db/repositories/client'
import { isDueForRetentionReview } from '@/server/gdpr/retention-policy'

async function main() {
  const now = new Date()
  const rows = await prisma.candidate.findMany({
    where: {
      deletedAt: null,
      status: { in: ['INACTIF', 'BLACKLISTE'] },
    },
    select: { id: true, status: true, updatedAt: true },
  })

  const due = rows.filter((row) => {
    const category = row.status === 'BLACKLISTE' ? 'CANDIDATE_BLACKLISTED' : 'CANDIDATE_INACTIVE'
    return isDueForRetentionReview(category, row.updatedAt, now)
  })

  console.log(JSON.stringify({ reviewedAt: now.toISOString(), dueCount: due.length, due }, null, 2))
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
