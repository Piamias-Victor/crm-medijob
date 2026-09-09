import { describe, expect, it, vi } from 'vitest'
import { sendHireflixCalendarSmsTest } from './hireflix-calendar-sms-test'

describe('sendHireflixCalendarSmsTest', () => {
  it('sends the calendar SMS to the local test phone', async () => {
    const send = vi.fn()
    const result = await sendHireflixCalendarSmsTest({
      production: false,
      testPhone: '0624174724',
      send,
    })
    expect(result).toEqual({ ok: true, sentTo: '33624174724' })
    expect(send).toHaveBeenCalledWith('33624174724')
  })

  it('refuses to send in production', async () => {
    const send = vi.fn()
    const result = await sendHireflixCalendarSmsTest({
      production: true,
      testPhone: '0624174724',
      send,
    })
    expect(result).toEqual({ ok: false, reason: 'disabled' })
    expect(send).not.toHaveBeenCalled()
  })

  it('asks for the test phone env when it is missing', async () => {
    const send = vi.fn()
    const result = await sendHireflixCalendarSmsTest({
      production: false,
      send,
    })
    expect(result).toEqual({ ok: false, reason: 'test_phone_missing' })
    expect(send).not.toHaveBeenCalled()
  })
})
