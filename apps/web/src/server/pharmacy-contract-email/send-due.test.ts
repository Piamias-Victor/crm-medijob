import { describe, expect, it } from 'vitest'
import { sendDueContractSignEmails } from './send-due'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
import {
  contractSignEmailDueDeps,
  contractSignEmailDueRow,
  memoryContractSignEmailDue,
} from './send-due.fixtures'

describe('sendDueContractSignEmails', () => {
  it('mails pharmacy and primary contact with the pharmacy contact first name', async () => {
    const deps = contractSignEmailDueDeps()
    const result = await sendDueContractSignEmails(deps)
    expect(result.sent).toBe(1)
    expect(deps.sendEmail).toHaveBeenCalledWith({
      to: ['officine@example.com', 'marie@example.com'],
      firstName: 'Marie',
    })
    expect(deps.markSent).toHaveBeenCalledWith('row1')
    expect(deps.logSend).toHaveBeenCalledWith({
      type: 'EMAIL',
      content: AUTOMATIC_OUTBOUND.emailPharmacyContract,
      targets: [
        { entityType: 'PHARMACY', entityId: 'p1' },
        { entityType: 'CONTACT', entityId: 'ct1' },
      ],
    })
  })

  it('waits when neither pharmacy nor contact has a valid email', async () => {
    const deps = contractSignEmailDueDeps({
      listDue: async () => [
        contractSignEmailDueRow({ pharmacyEmail: null, primaryEmail: 'nope' }),
      ],
    })
    const result = await sendDueContractSignEmails(deps)
    expect(result).toEqual({ sent: 0, skippedNoEmail: 1, failed: 0 })
    expect(deps.sendEmail).not.toHaveBeenCalled()
    expect(deps.markSent).not.toHaveBeenCalled()
    expect(deps.logSend).not.toHaveBeenCalled()
  })

  it('sends once per CREATED contract then stops', async () => {
    const deps = memoryContractSignEmailDue([contractSignEmailDueRow()])
    expect((await sendDueContractSignEmails(deps)).sent).toBe(1)
    expect((await sendDueContractSignEmails(deps)).sent).toBe(0)
    expect(deps.sendEmail).toHaveBeenCalledTimes(1)
  })
})
