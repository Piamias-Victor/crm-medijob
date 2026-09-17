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
  it('mails the Brevo template without a Hireflix URL and marks sent', async () => {
    const d = deps()
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(d.sendInviteEmail).toHaveBeenCalledWith({
      to: 'camille@example.com',
      firstName: 'Camille',
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
    expect(d.sendInviteEmail).not.toHaveBeenCalled()
  })

  it('mails even when a Hireflix URL is already stored', async () => {
    const row = profile({
      hireflixInterviewId: 'hf1',
      hireflixUrl: 'https://app.hireflix.com/abc',
    })
    const d = deps({ listDue: async () => [row], findById: async () => row })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(d.sendInviteEmail).toHaveBeenCalledWith({
      to: 'camille@example.com',
      firstName: 'Camille',
    })
  })
})
