import { describe, expect, it, vi } from 'vitest'
import { inviteDueAppProfiles } from './invite-due'
import { inviteDeps, inviteProfile } from './invite-due.fixtures'

describe('inviteDueAppProfiles calendar SMS', () => {
  it('sends the calendar SMS after the Hireflix mail when a phone exists', async () => {
    const row = inviteProfile({ phone: '0612345678' })
    const sendCalendarSms = vi.fn()
    const d = inviteDeps({
      listDue: async () => [row],
      findById: async () => row,
      sendCalendarSms,
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(d.sendInviteEmail).toHaveBeenCalled()
    expect(sendCalendarSms).toHaveBeenCalledWith('33612345678')
  })

  it('skips the calendar SMS when the profile has no phone', async () => {
    const sendCalendarSms = vi.fn()
    const d = inviteDeps({ sendCalendarSms })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(sendCalendarSms).not.toHaveBeenCalled()
  })

  it('skips the calendar SMS when Hireflix test override is set', async () => {
    const row = inviteProfile({ phone: '0612345678' })
    const sendCalendarSms = vi.fn()
    const d = inviteDeps({
      listDue: async () => [row],
      findById: async () => row,
      sendCalendarSms,
      testTo: 'victorpiamiaspro@gmail.com',
    })
    await inviteDueAppProfiles(d)
    expect(sendCalendarSms).not.toHaveBeenCalled()
  })

  it('still marks the invitation sent when the calendar SMS fails', async () => {
    const row = inviteProfile({ phone: '0612345678' })
    const sendCalendarSms = vi.fn().mockRejectedValue(new Error('sms down'))
    const d = inviteDeps({
      listDue: async () => [row],
      findById: async () => row,
      sendCalendarSms,
    })
    const result = await inviteDueAppProfiles(d)
    expect(result.sent).toBe(1)
    expect(result.failed).toBe(0)
    expect(d.saveSent).toHaveBeenCalledWith('p1')
  })
})
