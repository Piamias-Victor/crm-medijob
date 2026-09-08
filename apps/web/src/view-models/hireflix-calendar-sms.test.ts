import { describe, expect, it } from 'vitest'
import {
  HIREFLIX_CALENDAR_SMS_URL,
  hireflixCalendarSmsContent,
} from './hireflix-calendar-sms'

describe('hireflixCalendarSmsContent', () => {
  it('includes the Google Calendar booking URL', () => {
    expect(hireflixCalendarSmsContent()).toContain(
      'https://calendar.app.google/Xi14JMbKF3wg3b7s8',
    )
    expect(HIREFLIX_CALENDAR_SMS_URL).toBe(
      'https://calendar.app.google/Xi14JMbKF3wg3b7s8',
    )
  })
})
