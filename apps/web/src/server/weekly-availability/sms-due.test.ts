import { describe, expect, it } from 'vitest'
import { sendDueAvailabilitySms } from './sms-due'
import { memorySmsDue, smsDueDeps, smsDueRow } from './sms-due.fixtures'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
import {
  weeklyAvailabilityReminderSmsContent,
  weeklyAvailabilitySmsContent,
} from '@/view-models/weekly-availability-sms'

describe('sendDueAvailabilitySms', () => {
  it('texts the secret weekly availability URL to the Candidate', async () => {
    const deps = smsDueDeps({ testTo: undefined })
    const result = await sendDueAvailabilitySms(deps)
    expect(result.sent).toBe(1)
    expect(deps.sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: weeklyAvailabilitySmsContent('http://localhost:3000/dispo/secret-token'),
    })
    expect(deps.markSent).toHaveBeenCalledWith('c1')
  })

  it('routes the SMS to the tester phone when the override is set', async () => {
    const deps = smsDueDeps()
    await sendDueAvailabilitySms(deps)
    expect(deps.sendSms).toHaveBeenCalledWith(
      expect.objectContaining({ to: '33699999999' }),
    )
  })

  it('waits when the Candidate has no phone and no override', async () => {
    const row = smsDueRow({ phone: null })
    const deps = smsDueDeps({ listDue: async () => [row], testTo: undefined })
    const result = await sendDueAvailabilitySms(deps)
    expect(result).toEqual({ sent: 0, skippedNoPhone: 1, failed: 0 })
    expect(deps.sendSms).not.toHaveBeenCalled()
    expect(deps.markSent).not.toHaveBeenCalled()
  })

  it('sends once when the phone arrives on a later run', async () => {
    const rows = [smsDueRow({ phone: null })]
    const deps = memorySmsDue(rows)
    deps.testTo = undefined
    expect((await sendDueAvailabilitySms(deps)).skippedNoPhone).toBe(1)
    rows[0] = smsDueRow()
    expect((await sendDueAvailabilitySms(deps)).sent).toBe(1)
    expect((await sendDueAvailabilitySms(deps)).sent).toBe(0)
    expect(deps.sendSms).toHaveBeenCalledTimes(1)
  })

  it('does not send a second automatic SMS on restore', async () => {
    const deps = memorySmsDue([smsDueRow()])
    expect((await sendDueAvailabilitySms(deps)).sent).toBe(1)
    expect((await sendDueAvailabilitySms(deps)).sent).toBe(0)
    expect(deps.sendSms).toHaveBeenCalledTimes(1)
  })

  it('texts the reminder copy when the row is a 15-day refresh', async () => {
    const deps = smsDueDeps({
      testTo: undefined,
      listDue: async () => [smsDueRow({ kind: 'reminder' })],
    })
    await sendDueAvailabilitySms(deps)
    expect(deps.sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: weeklyAvailabilityReminderSmsContent('http://localhost:3000/dispo/secret-token'),
    })
    expect(deps.markSent).toHaveBeenCalledWith('c1')
    expect(deps.logSend).toHaveBeenCalledWith(
      expect.objectContaining({ content: AUTOMATIC_OUTBOUND.smsAvailabilityReminder }),
    )
  })

  it('writes SMS ActivityLog on the Candidate after a real send', async () => {
    const deps = smsDueDeps({ testTo: undefined })
    await sendDueAvailabilitySms(deps)
    expect(deps.logSend).toHaveBeenCalledWith({
      type: 'SMS',
      content: AUTOMATIC_OUTBOUND.smsAvailability,
      targets: [{ entityType: 'CANDIDATE', entityId: 'c1' }],
    })
  })

  it('does not write ActivityLog when the Candidate has no phone', async () => {
    const row = smsDueRow({ phone: null })
    const deps = smsDueDeps({ listDue: async () => [row], testTo: undefined })
    await sendDueAvailabilitySms(deps)
    expect(deps.logSend).not.toHaveBeenCalled()
  })
})
