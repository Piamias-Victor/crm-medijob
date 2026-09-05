import { PrismaClient } from '@prisma/client'

async function main() {
  const db = new PrismaClient()
  const now = new Date()
  const beforeDue = await db.appProfile.count({
    where: { status: 'EN_ATTENTE', inviteEmailSentAt: null },
  })
  const result = await db.appProfile.updateMany({
    where: { status: 'EN_ATTENTE', inviteEmailSentAt: null },
    data: { inviteEmailSentAt: now, inviteLastError: null },
  })
  const stillDue = await db.appProfile.count({
    where: { status: 'EN_ATTENTE', inviteEmailSentAt: null },
  })
  const totalWithSentAt = await db.appProfile.count({
    where: { inviteEmailSentAt: { not: null } },
  })
  console.log(
    JSON.stringify(
      { beforeDue, updated: result.count, stillDue, totalWithSentAt, at: now.toISOString() },
      null,
      2,
    ),
  )
  await db.$disconnect()
}

main().catch(async (error) => {
  console.error(error)
  process.exit(1)
})
