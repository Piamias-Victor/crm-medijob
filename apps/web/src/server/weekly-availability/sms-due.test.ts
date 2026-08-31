import { describe, expect, it } from 'vitest'
import { sendDueAvailabilitySms } from './sms-due'
import { memorySmsDue, smsDueDeps, smsDueRow } from './sms-due.fixtures'

describe('sendDueAvailabilitySms', () => {
  it('sends one SMS with the secret weekly availability URL', async () => {
    const deps = smsDueDeps()
    const result = await sendDueAvailabilitySms(deps)
    expect(result.sent).toBe(1)
    expect(deps.sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: expect.stringContaining('http://localhost:3000/dispo/secret-token'),
    })
    expect(deps.markSent).toHaveBeenCalledWith('c1')
  })

  it('waits when the Candidate has no phone', async () => {
    const row = smsDueRow({ phone: null })
    const deps = smsDueDeps({ listDue: async () => [row] })
    const result = await sendDueAvailabilitySms(deps)
    expect(result).toEqual({ sent: 0, skippedNoPhone: 1, failed: 0 })
    expect(deps.sendSms).not.toHaveBeenCalled()
    expect(deps.markSent).not.toHaveBeenCalled()
  })

  it('sends once when the phone arrives on a later run', async () => {
    const rows = [smsDueRow({ phone: null })]
    const deps = memorySmsDue(rows)
    expect((await sendDueAvailabilitySms(deps)).skippedNoPhone).toBe(1)
    rows[0] = smsDueRow({ phone: '0612345678' })
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
