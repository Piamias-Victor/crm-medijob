import { sendAvailabilitySms, type SmsInput } from '@/server/sms/send'
import { hireflixCalendarSmsContent } from '@/view-models/hireflix-calendar-sms'
import type { HireflixCalendarSmsEnv } from './hireflix-calendar-sms-enabled'
import { sendHireflixCalendarSmsTest } from './hireflix-calendar-sms-test'

type SendSms = (input: SmsInput) => Promise<void>

export function runHireflixCalendarSmsTest(
  env: HireflixCalendarSmsEnv = process.env,
  sendSms: SendSms = sendAvailabilitySms,
) {
  return sendHireflixCalendarSmsTest({
    production: env.VERCEL_ENV === 'production',
    testPhone: env.HIREFLIX_CALENDAR_SMS_TEST_PHONE,
    send: (to) => sendSms({ to, content: hireflixCalendarSmsContent() }),
  })
}
