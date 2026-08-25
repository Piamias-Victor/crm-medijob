import { describe, expect, it } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps, inviteProfile } from './invite-due.fixtures'

describe('inviteDueAppProfiles cancel', () => {
  it('does not mail if the AppProfile left EN_ATTENTE', async () => {
    const pending = inviteProfile()
    const ignored = inviteProfile({ status: 'IGNORE' })
    const d = inviteDeps({
      listDue: async () => [pending],
      findById: async () => ignored,
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.cancelled).toBe(1)
    expect(d.sendInviteEmail).not.toHaveBeenCalled()
    expect(d.saveSent).not.toHaveBeenCalled()
  })
})
