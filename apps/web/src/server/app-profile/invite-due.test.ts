import { describe, expect, it } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps, inviteProfile } from './invite-due.fixtures'
import type { InviteDueDeps, InviteDueProfile } from './invite-due.types'

function profile(overrides: Partial<InviteDueProfile> = {}) {
  return inviteProfile(overrides)
}

function deps(overrides: Partial<InviteDueDeps> = {}) {
  return inviteDeps(overrides)
}

describe('inviteDueAppProfiles', () => {
  it('mails the Hireflix URL and marks the invitation sent', async () => {
    const d = deps()
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(d.sendInviteEmail).toHaveBeenCalledWith({
      to: 'camille@example.com',
      firstName: 'Camille',
      url: 'https://app.hireflix.com/abc',
    })
    expect(d.saveSent).toHaveBeenCalledWith('p1')
  })

  it('waits when the AppProfile has no email', async () => {
    const row = profile({ email: null })
    const d = deps({ listDue: async () => [row], findById: async () => row })
    const result = await inviteDueAppProfiles(d)
    expect(result).toEqual({
      sent: 0,
      skippedNoEmail: 1,
      cancelled: 0,
      failed: 0,
    })
    expect(d.inviteHireflix).not.toHaveBeenCalled()
    expect(d.sendInviteEmail).not.toHaveBeenCalled()
  })

  it('does not create a second Hireflix interview when the URL exists', async () => {
    const row = profile({
      hireflixInterviewId: 'hf1',
      hireflixUrl: 'https://app.hireflix.com/abc',
    })
    const d = deps({ listDue: async () => [row], findById: async () => row })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(d.inviteHireflix).not.toHaveBeenCalled()
    expect(d.sendInviteEmail).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://app.hireflix.com/abc' }),
    )
  })
})
