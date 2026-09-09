import { describe, expect, it, vi } from 'vitest'
import { hireflixCalendarSmsContent } from '@/view-models/hireflix-calendar-sms'
import { runHireflixCalendarSmsTest } from './hireflix-calendar-sms-test-run'

describe('runHireflixCalendarSmsTest', () => {
  it('sends the booking SMS to HIREFLIX_CALENDAR_SMS_TEST_PHONE', async () => {
    const sendSms = vi.fn()
    const result = await runHireflixCalendarSmsTest(
      { HIREFLIX_CALENDAR_SMS_TEST_PHONE: '0624174724' },
      sendSms,
    )
    expect(result).toEqual({ ok: true, sentTo: '33624174724' })
    expect(sendSms).toHaveBeenCalledWith({
      to: '33624174724',
      content: hireflixCalendarSmsContent(),
    })
  })
})
