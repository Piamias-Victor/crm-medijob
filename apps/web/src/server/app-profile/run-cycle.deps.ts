import { inviteDueAppProfiles } from '@/server/app-profile/invite-due'
import { syncValidatedEmployees } from '@/server/app-profile/sync-validated.deps'
import { defaultInviteDueDeps } from '@/server/app-profile/invite-due.deps'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { defaultAppProfileDeps } from '@/server/routers/app-profile.deps'
import { badakanClientFromEnv, type BadakanClient } from '@/server/badakan/client'
import type { SyncDeps } from '@/server/app-profile/sync'
import type { SyncValidatedResult } from '@/server/app-profile/sync-validated.types'
import type { InviteDueResult } from '@/server/app-profile/invite-due.types'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export type AppProfileCycleDeps = {
  client: BadakanClient
  findByBadakanIds: SyncDeps['findByBadakanIds']
  upsertPending: SyncDeps['upsertPending']
  findJobTitleIdByName: SyncDeps['findJobTitleIdByName']
  inviteDue: () => Promise<InviteDueResult>
  syncValidated: (rows: BadakanRecipient[]) => Promise<SyncValidatedResult>
}

export function defaultAppProfileCycleDeps(
  env: NodeJS.ProcessEnv,
  fetchFn?: typeof fetch,
): AppProfileCycleDeps {
  return {
    client: badakanClientFromEnv(env, fetchFn),
    findByBadakanIds: appProfileRepository.findByBadakanIds,
    upsertPending: appProfileRepository.upsertPending,
    findJobTitleIdByName: defaultAppProfileDeps.findJobTitleIdByName,
    inviteDue: () => inviteDueAppProfiles(defaultInviteDueDeps(env)),
    syncValidated: syncValidatedEmployees,
  }
}
