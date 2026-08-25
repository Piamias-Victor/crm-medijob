import { appProfileRepository } from '@/server/db/repositories/app-profile.repository'
import { appProfileInviteRepository } from '@/server/db/repositories/app-profile-invite.repository'
import { inviteHireflixCandidate } from '@/server/hireflix/invite'
import { sendHireflixInviteEmail } from '@/server/brevo/send-invite-email'
import { toInviteDueProfile } from './invite-due-map'
import type { InviteDueDeps } from './invite-due.types'

export function defaultInviteDueDeps(
  env: NodeJS.ProcessEnv = process.env,
): InviteDueDeps {
  const testTo = env.HIREFLIX_INVITE_TEST_TO?.trim()
  return {
    listDue: async () => {
      const rows = await appProfileInviteRepository.listDue()
      return rows.map(toInviteDueProfile)
    },
    findById: async (id) => {
      const row = await appProfileRepository.findById(id)
      return row ? toInviteDueProfile(row) : null
    },
    saveHireflix: async (id, data) => {
      await appProfileInviteRepository.saveHireflix(id, data)
    },
    saveSent: async (id) => {
      await appProfileInviteRepository.saveSent(id)
    },
    saveError: async (id, error) => {
      await appProfileInviteRepository.saveError(id, error)
    },
    inviteHireflix: (input) => inviteHireflixCandidate(input),
    sendInviteEmail: (input) => sendHireflixInviteEmail(input),
    testTo: testTo || undefined,
  }
}
