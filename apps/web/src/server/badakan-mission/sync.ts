import type { BadakanMission } from '@/server/badakan/map-mission'
import { syncPagedRead } from '@/server/badakan/sync-paged-read'

export type SyncBadakanMissionDeps = {
  searchMissions: () => Promise<BadakanMission[]>
  upsertFromRead: (row: BadakanMission) => Promise<unknown>
}

export function syncBadakanMissions(deps: SyncBadakanMissionDeps) {
  return syncPagedRead({ search: deps.searchMissions, upsertFromRead: deps.upsertFromRead })
}
