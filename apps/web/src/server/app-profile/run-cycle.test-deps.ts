import type { AppProfileCycleDeps } from './run-cycle'
import type { BadakanClient } from '@/server/badakan/client'

const emptyClient: BadakanClient = {
  searchNewEmployees: async () => [],
  searchEmployees: async () => [],
  searchMissions: async () => [],
  searchContracts: async () => [],
  getRecipient: async () => null,
  getComments: async () => [],
  getEnterprise: async () => null,
}

const emptyInvite = {
  sent: 0,
  skippedNoEmail: 0,
  cancelled: 0,
  failed: 0,
}

const emptySyncCount = { fetched: 0, upserted: 0 }

type CycleOverrides = Omit<Partial<AppProfileCycleDeps>, 'client'> & {
  client?: Partial<BadakanClient>
}

export function stubCycleDeps(overrides: CycleOverrides = {}): AppProfileCycleDeps {
  const { client, ...rest } = overrides
  return {
    client: { ...emptyClient, ...client },
    findByBadakanIds: async () => [],
    upsertPending: async () => ({}),
    findJobTitleIdByName: async () => null,
    inviteDue: async () => emptyInvite,
    syncValidated: async () => ({ created: 0, linked: 0, skipped: 0 }),
    probeInactive: async () => [],
    syncMissions: async () => emptySyncCount,
    syncEnterprises: async () => emptySyncCount,
    syncContracts: async () => emptySyncCount,
    smsDue: async () => ({ sent: 0, skippedNoPhone: 0, failed: 0 }),
    ...rest,
  }
}
