import type { BadakanContract } from '@/server/badakan/map-contract'

export type SyncBadakanContractDeps = {
  searchContracts: () => Promise<BadakanContract[]>
  upsertFromRead: (row: BadakanContract) => Promise<unknown>
}

export async function syncBadakanContracts(deps: SyncBadakanContractDeps) {
  const rows = await deps.searchContracts()
  for (const row of rows) {
    await deps.upsertFromRead(row)
  }
  return { fetched: rows.length, upserted: rows.length }
}
