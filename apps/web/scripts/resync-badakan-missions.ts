// Manual replay of the Badakan mission read, without the rest of the cron cycle.
// Run with: pnpm exec tsx --env-file=.env scripts/resync-badakan-missions.ts
import { badakanClientFromEnv } from '@/server/badakan/client'
import { badakanMissionRepository } from '@/server/db/repositories/badakan-mission.repository'
import { syncBadakanMissions } from '@/server/badakan-mission/sync'
import { defaultMissionReferentialResolver } from '@/server/badakan-mission/resolve-referentials.deps'

async function main() {
  const client = badakanClientFromEnv()
  const result = await syncBadakanMissions({
    searchMissions: () => client.searchMissions(),
    upsertFromRead: badakanMissionRepository.upsertFromRead,
    resolveReferentials: defaultMissionReferentialResolver(),
  })
  console.log('missions resynced', result)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
