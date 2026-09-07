import { syncAppProfiles } from '@/server/app-profile/sync'
import { mergeBadakanRecipients } from '@/server/app-profile/merge-badakan-recipients'
import {
  defaultAppProfileCycleDeps,
  type AppProfileCycleDeps,
} from '@/server/app-profile/run-cycle.deps'

export type { AppProfileCycleDeps }

export async function runAppProfileCycle(
  env: NodeJS.ProcessEnv = process.env,
  deps?: AppProfileCycleDeps,
) {
  if (!env.BADAKAN_EMAIL || !env.BADAKAN_PASSWORD) {
    return { skipped: true as const }
  }
  const resolved = deps ?? defaultAppProfileCycleDeps(env)
  const newcomers = await resolved.client.searchNewEmployees()
  const employees = await resolved.client.searchEmployees()
  const inactive = await resolved.probeInactive(employees)
  const validated = await resolved.syncValidated(
    mergeBadakanRecipients(newcomers, employees, inactive),
  )
  const sync = await syncAppProfiles({
    searchNewEmployees: async () => newcomers,
    findByBadakanIds: resolved.findByBadakanIds,
    upsertPending: resolved.upsertPending,
    findJobTitleIdByName: resolved.findJobTitleIdByName,
  })
  const invite = await resolved.inviteDue()
  const missions = await resolved.syncMissions()
  const enterprises = await resolved.syncEnterprises()
  const contracts = await resolved.syncContracts()
  return {
    sync,
    invite,
    employees: { fetched: employees.length, ...validated },
    missions,
    enterprises,
    contracts,
  }
}
