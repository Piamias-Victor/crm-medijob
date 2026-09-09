import { describe, expect, it } from 'vitest'
import { runAvailabilitySmsReminderCron } from './availability-sms-reminder'

describe('runAvailabilitySmsReminderCron', () => {
  it('sends reminder SMS when the cron flag is on', async () => {
    const result = await runAvailabilitySmsReminderCron({ CRON_ENABLED: 'true' }, async () => ({
      sent: 4,
      skippedNoPhone: 1,
      failed: 0,
    }))
    expect(result).toEqual({
      sms: { sent: 4, skippedNoPhone: 1, failed: 0 },
    })
  })

  it('stays off when the cron flag is missing', async () => {
    let sent = false
    const result = await runAvailabilitySmsReminderCron({}, async () => {
      sent = true
      return { sent: 1, skippedNoPhone: 0, failed: 0 }
    })
    expect(sent).toBe(false)
    expect(result).toEqual({ skipped: true, reason: 'cron_disabled' })
  })
})

describe('availability-sms-reminder schedule', () => {
  it('runs daily at 07:00 UTC with the first-send cron still every 5 minutes', async () => {
    const { crons } = await import('../../../vercel.json')
    expect(crons).toContainEqual({
      path: '/api/cron/availability-sms-reminder',
      schedule: '0 7 * * *',
    })
    expect(crons).toContainEqual({
      path: '/api/cron/availability-sms',
      schedule: '*/5 * * * *',
    })
  })
})
