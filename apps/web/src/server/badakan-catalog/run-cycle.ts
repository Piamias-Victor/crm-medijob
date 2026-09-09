import {
  defaultCatalogCycleDeps,
  type CatalogCycleDeps,
} from '@/server/badakan-catalog/run-cycle.deps'

export type { CatalogCycleDeps }

export async function runBadakanCatalogCycle(
  env: NodeJS.ProcessEnv = process.env,
  deps?: CatalogCycleDeps,
) {
  if (!env.BADAKAN_EMAIL || !env.BADAKAN_PASSWORD) {
    return { skipped: true as const }
  }
  const resolved = deps ?? defaultCatalogCycleDeps(env)
  const enterprises = await resolved.syncEnterprises()
  const pharmacies = await resolved.promoteReady()
  const contracts = await resolved.syncContracts()
  const sms = await resolved.sendSignInviteSms()
  return { enterprises, pharmacies, contracts, sms }
}
