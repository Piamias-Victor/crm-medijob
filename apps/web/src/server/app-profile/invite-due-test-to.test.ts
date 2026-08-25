import { describe, expect, it } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps, inviteProfile } from './invite-due.fixtures'

const TEST_TO = 'victorpiamiaspro@gmail.com'

describe('inviteDueAppProfiles test override', () => {
  it('sends Hireflix and Brevo to the test mailbox for one profile', async () => {
    const a = inviteProfile({ id: 'a', email: 'a@x.fr' })
    const b = inviteProfile({ id: 'b', email: 'b@x.fr' })
    const d = inviteDeps({
      listDue: async () => [a, b],
      findById: async (id) => (id === 'a' ? a : b),
      testTo: TEST_TO,
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(d.inviteHireflix).toHaveBeenCalledTimes(1)
    expect(d.inviteHireflix).toHaveBeenCalledWith(
      expect.objectContaining({ email: TEST_TO, externalId: 'a' }),
    )
    expect(d.sendInviteEmail).toHaveBeenCalledWith(
      expect.objectContaining({ to: TEST_TO }),
    )
    expect(d.saveSent).not.toHaveBeenCalled()
    expect(d.saveHireflix).not.toHaveBeenCalled()
  })
})
