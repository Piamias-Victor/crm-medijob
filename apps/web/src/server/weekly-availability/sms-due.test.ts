import { describe, expect, it } from 'vitest'
import { sendDueAvailabilitySms } from './sms-due'
import { memorySmsDue, smsDueDeps, smsDueRow } from './sms-due.fixtures'
import { weeklyAvailabilitySmsContent } from '@/view-models/weekly-availability-sms'

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
})
