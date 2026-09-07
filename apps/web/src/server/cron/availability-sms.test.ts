import { describe, expect, it } from 'vitest'
import { runAvailabilitySmsCron } from './availability-sms'

describe('runAvailabilitySmsCron', () => {
  it('sends due SMS without Badakan credentials', async () => {
    const result = await runAvailabilitySmsCron({ CRON_ENABLED: 'true' }, async () => ({
      sent: 3,
      skippedNoPhone: 0,
      skippedOutOfZone: 1,
      failed: 0,
    }))
    expect(result).toEqual({
      sms: { sent: 3, skippedNoPhone: 0, skippedOutOfZone: 1, failed: 0 },
    })
  })

  it('stays off when the cron flag is missing', async () => {
    let sent = false
    const result = await runAvailabilitySmsCron({}, async () => {
      sent = true
      return { sent: 1, skippedNoPhone: 0, skippedOutOfZone: 0, failed: 0 }
    })
    expect(sent).toBe(false)
    expect(result).toEqual({ skipped: true, reason: 'cron_disabled' })
  })
})
