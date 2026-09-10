import { describe, expect, it } from 'vitest'
import { sendDuePharmacyApplyEmails } from './send-due'
import { AUTOMATIC_OUTBOUND } from '@/view-models/automatic-outbound'
import {
  memoryPharmacyApplyDue,
  pharmacyApplyDueDeps,
  pharmacyApplyDueRow,
} from './send-due.fixtures'

describe('sendDuePharmacyApplyEmails', () => {
  it('mails pharmacy and primary contact with the pharmacy contact first name', async () => {
    const deps = pharmacyApplyDueDeps()
    const result = await sendDuePharmacyApplyEmails(deps)
    expect(result.sent).toBe(1)
    expect(deps.sendEmail).toHaveBeenCalledWith({
      to: ['officine@example.com', 'marie@example.com'],
      firstName: 'Marie',
    })
    expect(deps.markSent).toHaveBeenCalledWith('m-hermes', 'rec-1')
    expect(deps.logSend).toHaveBeenCalledWith({
      type: 'EMAIL',
      content: AUTOMATIC_OUTBOUND.emailPharmacyApply,
      targets: [
        { entityType: 'PHARMACY', entityId: 'p1' },
        { entityType: 'CONTACT', entityId: 'ct1' },
      ],
    })
  })

  it('waits when neither pharmacy nor contact has a valid email', async () => {
    const deps = pharmacyApplyDueDeps({
      listDue: async () => [
        pharmacyApplyDueRow({ pharmacyEmail: null, primaryEmail: 'nope' }),
      ],
    })
    const result = await sendDuePharmacyApplyEmails(deps)
    expect(result).toEqual({ sent: 0, skippedNoEmail: 1, failed: 0 })
    expect(deps.sendEmail).not.toHaveBeenCalled()
    expect(deps.markSent).not.toHaveBeenCalled()
    expect(deps.logSend).not.toHaveBeenCalled()
  })

  it('sends once per SEARCH_APPLIED then stops', async () => {
    const deps = memoryPharmacyApplyDue([pharmacyApplyDueRow()])
    expect((await sendDuePharmacyApplyEmails(deps)).sent).toBe(1)
    expect((await sendDuePharmacyApplyEmails(deps)).sent).toBe(0)
    expect(deps.sendEmail).toHaveBeenCalledTimes(1)
  })

  it('writes EMAIL on Pharmacy only when there is no Contact', async () => {
    const deps = pharmacyApplyDueDeps({
      listDue: async () => [pharmacyApplyDueRow({ contactId: null })],
    })
    await sendDuePharmacyApplyEmails(deps)
    expect(deps.logSend).toHaveBeenCalledWith(
      expect.objectContaining({
        targets: [{ entityType: 'PHARMACY', entityId: 'p1' }],
      }),
    )
  })
})
