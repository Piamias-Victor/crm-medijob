import { syncAppProfiles } from '@/server/app-profile/sync'
import { inviteDueAppProfiles } from '@/server/app-profile/invite-due'
import { defaultInviteDueDeps } from '@/server/app-profile/invite-due.deps'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { defaultAppProfileDeps } from '@/server/routers/app-profile.deps'
import { badakanClientFromEnv } from '@/server/badakan/client'

export async function runAppProfileCycle(env: NodeJS.ProcessEnv = process.env) {
  if (!env.BADAKAN_EMAIL || !env.BADAKAN_PASSWORD) {
    return { skipped: true as const }
  }
  const client = badakanClientFromEnv(env)
  const sync = await syncAppProfiles({
    searchNewEmployees: () => client.searchNewEmployees(),
    findByBadakanIds: appProfileRepository.findByBadakanIds,
    upsertPending: appProfileRepository.upsertPending,
    findJobTitleIdByName: defaultAppProfileDeps.findJobTitleIdByName,
  })
  const invite = await inviteDueAppProfiles(defaultInviteDueDeps(env))
  return { sync, invite }
}
