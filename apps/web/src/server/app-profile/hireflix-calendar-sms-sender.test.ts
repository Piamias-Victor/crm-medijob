import { describe, expect, it, vi } from 'vitest'
import { hireflixCalendarSmsContent } from '@/view-models/hireflix-calendar-sms'
import { hireflixCalendarSmsSender } from './hireflix-calendar-sms-sender'

describe('hireflixCalendarSmsSender', () => {
  it('returns nothing when the calendar SMS flag is off', () => {
    expect(
      hireflixCalendarSmsSender({ VERCEL_ENV: 'preview' }, vi.fn()),
    ).toBeUndefined()
  })

  it('sends the calendar SMS body through Brevo when the flag is on', async () => {
    const sendSms = vi.fn()
    const send = hireflixCalendarSmsSender(
      { VERCEL_ENV: 'preview', HIREFLIX_CALENDAR_SMS: 'true' },
      sendSms,
    )
    expect(send).toBeDefined()
    await send?.('33612345678')
    expect(sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: hireflixCalendarSmsContent(),
    })
  })
})
