import type { BadakanContract } from '@/server/badakan/map-contract'
import { syncPagedRead } from '@/server/badakan/sync-paged-read'

export type SyncBadakanContractDeps = {
  searchContracts: () => Promise<BadakanContract[]>
  upsertFromRead: (row: BadakanContract) => Promise<unknown>
}

export function syncBadakanContracts(deps: SyncBadakanContractDeps) {
  return syncPagedRead({ search: deps.searchContracts, upsertFromRead: deps.upsertFromRead })
}
