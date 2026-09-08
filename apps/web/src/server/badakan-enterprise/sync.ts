import type { BadakanEnterprise } from '@/server/badakan/map-enterprise'
import { pickEnterprisePerSiret } from './pick-per-siret'

export type SyncBadakanEnterpriseDeps = {
  listEnterpriseIds: () => Promise<string[]>
  getEnterprise: (id: string) => Promise<BadakanEnterprise | null>
  upsertFromRead: (row: BadakanEnterprise) => Promise<unknown>
}

export async function syncBadakanEnterprises(deps: SyncBadakanEnterpriseDeps) {
  const ids = [...new Set(await deps.listEnterpriseIds())]
  const rows: BadakanEnterprise[] = []
  for (const id of ids) {
    const row = await deps.getEnterprise(id)
    if (row) rows.push(row)
  }
  const picked = pickEnterprisePerSiret(rows)
  for (const row of picked) {
    await deps.upsertFromRead(row)
  }
  return { fetched: ids.length, upserted: picked.length }
}
