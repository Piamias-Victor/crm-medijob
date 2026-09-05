/**
 * Test ciblé App-validated (pas le cron).
 * Usage: cd apps/web && pnpm exec tsx --env-file=.env src/server/app-profile/sync-one-cli.ts
 */
import { badakanClientFromEnv } from '@/server/badakan/client'
import { syncValidatedEmployees } from '@/server/app-profile/sync-validated.deps'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { defaultSmsDueDeps } from '@/server/weekly-availability/sms-due.deps'
import { sendOneAvailabilitySms } from '@/server/weekly-availability/sms-due-one'

const TOUNKARA_BADAKAN_ID = '6a94d9e7bedba3c1f32c2d05'

async function main() {
  const badakanId = process.env.BADAKAN_ID?.trim() || TOUNKARA_BADAKAN_ID
  const row = await badakanClientFromEnv(process.env).getRecipient(badakanId)
  if (!row) throw new Error(`recipient missing ${badakanId}`)

  const sync = await syncValidatedEmployees([row])
  const linked = await candidateRepository.findByBadakanId(badakanId)
  if (!linked) throw new Error('Candidate origin App not found after sync')

  const sms = await sendOneAvailabilitySms(
    { candidateId: linked.id, firstName: row.firstName, phone: row.phone },
    defaultSmsDueDeps(process.env),
  )

  console.log(
    JSON.stringify(
      {
        badakanId,
        name: `${row.firstName} ${row.lastName}`.trim(),
        badakanStatus: row.status,
        sync,
        candidateId: linked.id,
        sms,
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
