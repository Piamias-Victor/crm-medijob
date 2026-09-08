import { badakanEnterpriseRepository } from '@/server/db/repositories/badakan-enterprise.repository'
import { badakanContractRepository } from '@/server/db/repositories/badakan-contract.repository'
import { badakanClientFromEnv } from '@/server/badakan/client'
import { syncBadakanEnterprises } from '@/server/badakan-enterprise/sync'
import { syncBadakanContracts } from '@/server/badakan-contract/sync'
import { promoteReadyEnterprises } from '@/server/badakan-enterprise/promote-ready'
import { defaultBadakanEnterpriseDeps } from '@/server/routers/badakan-enterprise.deps'

export type CatalogCycleDeps = {
  syncEnterprises: () => Promise<{ fetched: number; upserted: number }>
  promoteReady: () => Promise<{ created: number; skipped: number }>
  syncContracts: () => Promise<{ fetched: number; upserted: number }>
}

export function defaultCatalogCycleDeps(
  env: NodeJS.ProcessEnv,
  fetchFn?: typeof fetch,
): CatalogCycleDeps {
  const client = badakanClientFromEnv(env, fetchFn)
  return {
    syncEnterprises: () =>
      syncBadakanEnterprises({
        listEnterpriseIds: () => client.searchEnterprises(),
        getEnterprise: (id) => client.getEnterprise(id),
        upsertFromRead: badakanEnterpriseRepository.upsertFromRead,
      }),
    promoteReady: () => promoteReadyEnterprises(defaultBadakanEnterpriseDeps),
    syncContracts: () =>
      syncBadakanContracts({
        searchContracts: () => client.searchContracts(),
        upsertFromRead: badakanContractRepository.upsertFromRead,
      }),
  }
}
