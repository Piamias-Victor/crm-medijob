import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'

export type SyncBadakanEnterpriseDeps = {
  listEnterpriseIds: () => Promise<string[]>
  getEnterprise: (id: string) => Promise<BadakanEnterprise | null>
  upsertFromRead: (row: BadakanEnterprise) => Promise<unknown>
}

export async function syncBadakanEnterprises(deps: SyncBadakanEnterpriseDeps) {
  const ids = [...new Set(await deps.listEnterpriseIds())]
  let upserted = 0
  for (const id of ids) {
    const row = await deps.getEnterprise(id)
    if (!row) continue
    await deps.upsertFromRead(row)
    upserted += 1
  }
  return { fetched: ids.length, upserted }
}
