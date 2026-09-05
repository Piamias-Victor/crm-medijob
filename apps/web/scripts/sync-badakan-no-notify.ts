/**
 * One-shot Badakan sync against current DATABASE_URL — NO SMS / Hireflix / email.
 * Usage: cd apps/web && pnpm exec tsx --env-file=.env scripts/sync-badakan-no-notify.ts
 */
import { runAppProfileCycle } from '@/server/app-profile/run-cycle'
import { defaultAppProfileCycleDeps } from '@/server/app-profile/run-cycle.deps'

async function main() {
  const base = defaultAppProfileCycleDeps(process.env)
  const result = await runAppProfileCycle(process.env, {
    ...base,
    smsDue: async () => ({ sent: 0, skippedNoPhone: 0, failed: 0 }),
    inviteDue: async () => ({
      sent: 0,
      skippedNoEmail: 0,
      failed: 0,
      cancelled: 0,
    }),
  })
  console.log(JSON.stringify(result, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
