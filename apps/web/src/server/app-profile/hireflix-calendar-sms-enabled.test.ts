import { describe, expect, it } from 'vitest'
import { isHireflixCalendarSmsEnabled } from './hireflix-calendar-sms-enabled'

describe('isHireflixCalendarSmsEnabled', () => {
  it('turns on in Vercel production when the flag is true', () => {
    expect(
      isHireflixCalendarSmsEnabled({
        VERCEL_ENV: 'production',
        HIREFLIX_CALENDAR_SMS: 'true',
      }),
    ).toBe(true)
  })

  it('turns on in preview when the flag is true', () => {
    expect(
      isHireflixCalendarSmsEnabled({
        VERCEL_ENV: 'preview',
        HIREFLIX_CALENDAR_SMS: 'true',
      }),
    ).toBe(true)
  })

  it('stays off when the flag is unset', () => {
    expect(isHireflixCalendarSmsEnabled({ VERCEL_ENV: 'preview' })).toBe(false)
  })

  it('turns on locally when the flag is true and VERCEL_ENV is unset', () => {
    expect(isHireflixCalendarSmsEnabled({ HIREFLIX_CALENDAR_SMS: 'true' })).toBe(
      true,
    )
  })
})
