import type { BadakanMission } from '@/server/badakan/map-mission'
import { syncPagedRead } from '@/server/badakan/sync-paged-read'
import type { MissionReferentialIds } from './resolve-referentials'

export type BadakanMissionToPersist = BadakanMission & MissionReferentialIds

export type SyncBadakanMissionDeps = {
  searchMissions: () => Promise<BadakanMission[]>
  upsertFromRead: (row: BadakanMissionToPersist) => Promise<unknown>
  resolveReferentials?: (mission: BadakanMission) => Promise<MissionReferentialIds>
}

const UNRESOLVED: MissionReferentialIds = { jobTitleId: null, softwareId: null }

export function syncBadakanMissions(deps: SyncBadakanMissionDeps) {
  return syncPagedRead({
    search: deps.searchMissions,
    upsertFromRead: async (mission) => {
      const resolved = deps.resolveReferentials
        ? await deps.resolveReferentials(mission)
        : UNRESOLVED
      return deps.upsertFromRead({ ...mission, ...resolved })
    },
  })
}
