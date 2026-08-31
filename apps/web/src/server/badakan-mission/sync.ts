import type { BadakanMission } from '@/server/badakan/map-mission'

export type SyncBadakanMissionDeps = {
  searchMissions: () => Promise<BadakanMission[]>
  upsertFromRead: (row: BadakanMission) => Promise<unknown>
}

export async function syncBadakanMissions(deps: SyncBadakanMissionDeps) {
  const rows = await deps.searchMissions()
  for (const row of rows) {
    await deps.upsertFromRead(row)
  }
  return { fetched: rows.length, upserted: rows.length }
}
