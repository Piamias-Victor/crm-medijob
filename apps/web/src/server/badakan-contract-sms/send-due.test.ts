import { describe, expect, it } from 'vitest'
import { sendDueContractSignSms } from './send-due'
import {
  contractSmsDueDeps,
  contractSmsDueRow,
  memoryContractSmsDue,
} from './send-due.fixtures'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
import {
  badakanContractReminderSmsContent,
  badakanContractSignSmsContent,
} from '@/view-models/badakan-contract-sms'

describe('sendDueContractSignSms', () => {
  it('texts the sign-invite copy when a CREATED contract is new', async () => {
    const deps = contractSmsDueDeps()
    const result = await sendDueContractSignSms(deps)
    expect(result.sent).toBe(1)
    expect(deps.sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: badakanContractSignSmsContent,
    })
    expect(deps.markSent).toHaveBeenCalledWith('row1', 'first')
    expect(deps.logSend).toHaveBeenCalledWith({
      type: 'SMS',
      content: AUTOMATIC_OUTBOUND.smsContractSign,
      targets: [{ entityType: 'CANDIDATE', entityId: 'c1' }],
    })
  })

  it('texts the reminder copy 24h later while still CREATED', async () => {
    const deps = contractSmsDueDeps({
      listDue: async () => [contractSmsDueRow({ kind: 'reminder' })],
    })
    await sendDueContractSignSms(deps)
    expect(deps.sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: badakanContractReminderSmsContent,
    })
    expect(deps.markSent).toHaveBeenCalledWith('row1', 'reminder')
    expect(deps.logSend).toHaveBeenCalledWith(
      expect.objectContaining({ content: AUTOMATIC_OUTBOUND.smsContractReminder }),
    )
  })

  it('waits when the Candidate has no phone', async () => {
    const deps = contractSmsDueDeps({
      listDue: async () => [contractSmsDueRow({ phone: null })],
    })
    const result = await sendDueContractSignSms(deps)
    expect(result).toEqual({ sent: 0, skippedNoPhone: 1, failed: 0 })
    expect(deps.sendSms).not.toHaveBeenCalled()
    expect(deps.markSent).not.toHaveBeenCalled()
    expect(deps.logSend).not.toHaveBeenCalled()
  })

  it('sends once per contract then stops', async () => {
    const deps = memoryContractSmsDue([contractSmsDueRow()])
    expect((await sendDueContractSignSms(deps)).sent).toBe(1)
    expect((await sendDueContractSignSms(deps)).sent).toBe(0)
    expect(deps.sendSms).toHaveBeenCalledTimes(1)
  })

  it('sends one SMS per CREATED contract', async () => {
    const deps = contractSmsDueDeps({
      listDue: async () => [
        contractSmsDueRow(),
        contractSmsDueRow({ contractId: 'row2' }),
      ],
    })
    expect((await sendDueContractSignSms(deps)).sent).toBe(2)
    expect(deps.sendSms).toHaveBeenCalledTimes(2)
  })
})
