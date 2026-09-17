import { describe, expect, it, vi } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps } from './invite-due.fixtures'

describe('inviteDueAppProfiles failure', () => {
  it('still mails Brevo when Hireflix would have failed', async () => {
    const d = inviteDeps({
      inviteHireflix: vi.fn().mockRejectedValue(new Error('hireflix down')),
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(result.failed).toBe(0)
    expect(d.sendInviteEmail).toHaveBeenCalled()
    expect(d.saveSent).toHaveBeenCalledWith('p1')
    expect(d.saveError).not.toHaveBeenCalled()
  })
})
