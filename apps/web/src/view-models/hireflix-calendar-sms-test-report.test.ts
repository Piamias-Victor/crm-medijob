import { describe, expect, it } from 'vitest'
import { calendarSmsTestMessage } from './hireflix-calendar-sms-test-report'

describe('calendarSmsTestMessage', () => {
  it('confirms the test phone that received the SMS', () => {
    expect(calendarSmsTestMessage({ ok: true, sentTo: '33624174724' })).toBe(
      'SMS créneau envoyé au 33624174724.',
    )
  })

  it('tells the tester which env var is missing', () => {
    expect(
      calendarSmsTestMessage({ ok: false, reason: 'test_phone_missing' }),
    ).toContain('HIREFLIX_CALENDAR_SMS_TEST_PHONE')
  })
})
