import { inviteDueAppProfiles } from '@/server/app-profile/invite-due'
import { defaultInviteDueDeps } from '@/server/app-profile/invite-due.deps'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { defaultAppProfileDeps } from '@/server/routers/app-profile.deps'
import { badakanClientFromEnv, type BadakanClient } from '@/server/badakan/client'
import type { SyncDeps } from '@/server/app-profile/sync'
import type { InviteDueResult } from '@/server/app-profile/invite-due.types'

export type AppProfileCycleDeps = {
  client: BadakanClient
  findByBadakanIds: SyncDeps['findByBadakanIds']
  upsertPending: SyncDeps['upsertPending']
  findJobTitleIdByName: SyncDeps['findJobTitleIdByName']
  inviteDue: () => Promise<InviteDueResult>
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
  }
}
