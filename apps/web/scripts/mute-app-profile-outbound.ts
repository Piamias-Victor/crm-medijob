/**
 * READ-safe then mute: stamp inviteEmailSentAt + calendarSmsSentAt on ALL
 * AppProfiles still due — blocks Hireflix/Brevo cron before Syncro import.
 *
 * Usage (PROD):
 *   cd apps/web
 *   DATABASE_URL="$(tofu -chdir=../../infra workspace select default >/dev/null; tofu -chdir=../../infra output -raw database_url)" \
 *     pnpm exec tsx scripts/mute-app-profile-outbound.ts
 */
import { PrismaClient } from '@prisma/client'

async function main() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL required')
  const host = url.match(/@([^/:?]+)/)?.[1] ?? '?'
  if (host.includes('recette')) {
    console.error('Refusing: host looks like RECETTE:', host)
    process.exit(2)
  }
  const prisma = new PrismaClient()
  const beforeDue = await prisma.appProfile.count({
    where: { status: { not: 'IGNORE' }, inviteEmailSentAt: null },
  })
  const now = new Date()
  const invite = await prisma.appProfile.updateMany({
    where: { inviteEmailSentAt: null },
    data: {
      inviteEmailSentAt: now,
      inviteLastError: 'syncro_import_muted',
    },
  })
  const sms = await prisma.appProfile.updateMany({
    where: { calendarSmsSentAt: null },
    data: { calendarSmsSentAt: now },
  })
  const dueLeft = await prisma.appProfile.count({
    where: { status: { not: 'IGNORE' }, inviteEmailSentAt: null },
  })
  console.log(
    JSON.stringify(
      {
        host,
        beforeDue,
        inviteMuted: invite.count,
        smsMuted: sms.count,
        dueLeft,
      },
      null,
      2,
    ),
  )
  await prisma.$disconnect()
  if (dueLeft !== 0) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
