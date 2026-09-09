import { describe, expect, it } from 'vitest'
import { runInterimNeedSmsCron } from './interim-need-sms'

describe('runInterimNeedSmsCron', () => {
  it('sends due SMS when the cron flag is on', async () => {
    const result = await runInterimNeedSmsCron({ CRON_ENABLED: 'true' }, async () => ({
      sent: 2,
      skippedNoPhone: 1,
      skippedInit: 3,
      failed: 0,
    }))
    expect(result).toEqual({
      sms: { sent: 2, skippedNoPhone: 1, skippedInit: 3, failed: 0 },
    })
  })

  it('stays off when the cron flag is missing', async () => {
    let sent = false
    const result = await runInterimNeedSmsCron({}, async () => {
      sent = true
      return { sent: 1, skippedNoPhone: 0, skippedInit: 0, failed: 0 }
    })
    expect(sent).toBe(false)
    expect(result).toEqual({ skipped: true, reason: 'cron_disabled' })
  })
})
