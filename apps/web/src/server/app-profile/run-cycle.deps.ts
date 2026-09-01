import { inviteDueAppProfiles } from '@/server/app-profile/invite-due'
import { syncValidatedEmployees } from '@/server/app-profile/sync-validated.deps'
import { defaultInviteDueDeps } from '@/server/app-profile/invite-due.deps'
import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { badakanMissionRepository } from '@/server/db/repositories/badakan-mission.repository'
import { badakanEnterpriseRepository } from '@/server/db/repositories/badakan-enterprise.repository'
import { defaultAppProfileDeps } from '@/server/routers/app-profile.deps'
import { badakanClientFromEnv, type BadakanClient } from '@/server/badakan/client'
import { syncBadakanMissions } from '@/server/badakan-mission/sync'
import { syncBadakanEnterprises } from '@/server/badakan-enterprise/sync'
import type { SyncDeps } from '@/server/app-profile/sync'
import type { SyncValidatedResult } from '@/server/app-profile/sync-validated.types'
import { candidateRepository } from '@/server/db/repositories/candidate.repository'
import { probeInactiveRecipients } from '@/server/app-profile/sync-validated-probe'
import { sendDueAvailabilitySms } from '@/server/weekly-availability/sms-due'
import { defaultSmsDueDeps } from '@/server/weekly-availability/sms-due.deps'
import type { InviteDueResult } from '@/server/app-profile/invite-due.types'
import type { SmsDueResult } from '@/server/weekly-availability/sms-due.types'
import type { BadakanRecipient } from '@/server/badakan/map-recipient'

export type AppProfileCycleDeps = {
  client: BadakanClient
  findByBadakanIds: SyncDeps['findByBadakanIds']
  upsertPending: SyncDeps['upsertPending']
  findJobTitleIdByName: SyncDeps['findJobTitleIdByName']
  inviteDue: () => Promise<InviteDueResult>
  smsDue: () => Promise<SmsDueResult>
  syncValidated: (rows: BadakanRecipient[]) => Promise<SyncValidatedResult>
  probeInactive: (completed: BadakanRecipient[]) => Promise<BadakanRecipient[]>
  syncMissions: () => Promise<{ fetched: number; upserted: number }>
  syncEnterprises: () => Promise<{ fetched: number; upserted: number }>
}

export function defaultAppProfileCycleDeps(
  env: NodeJS.ProcessEnv,
  fetchFn?: typeof fetch,
): AppProfileCycleDeps {
  const client = badakanClientFromEnv(env, fetchFn)
  return {
    client,
    findByBadakanIds: appProfileRepository.findByBadakanIds,
    upsertPending: appProfileRepository.upsertPending,
    findJobTitleIdByName: defaultAppProfileDeps.findJobTitleIdByName,
    inviteDue: () => inviteDueAppProfiles(defaultInviteDueDeps(env)),
    smsDue: () => sendDueAvailabilitySms(defaultSmsDueDeps(env)),
    syncValidated: syncValidatedEmployees,
    probeInactive: (completed) =>
      probeInactiveRecipients(completed, {
        listLinked: candidateRepository.listAppLinkedBadakanIds,
        getRecipient: (id) => client.getRecipient(id),
      }),
    syncMissions: () =>
      syncBadakanMissions({
        searchMissions: () => client.searchMissions(),
        upsertFromRead: badakanMissionRepository.upsertFromRead,
      }),
    syncEnterprises: () =>
      syncBadakanEnterprises({
        listEnterpriseIds: badakanMissionRepository.listEnterpriseIds,
        getEnterprise: (id) => client.getEnterprise(id),
        upsertFromRead: badakanEnterpriseRepository.upsertFromRead,
      }),
  }
}
