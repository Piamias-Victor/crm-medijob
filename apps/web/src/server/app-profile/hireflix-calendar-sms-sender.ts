import { sendAvailabilitySms, type SmsInput } from '@/server/sms/send'
import { hireflixCalendarSmsContent } from '@/view-models/hireflix-calendar-sms'
import {
  isHireflixCalendarSmsEnabled,
  type HireflixCalendarSmsEnv,
} from './hireflix-calendar-sms-enabled'

type SendSms = (input: SmsInput) => Promise<void>

export function hireflixCalendarSmsSender(
  env: HireflixCalendarSmsEnv = process.env,
  sendSms: SendSms = sendAvailabilitySms,
): ((to: string) => Promise<void>) | undefined {
  if (!isHireflixCalendarSmsEnabled(env)) return undefined
  return (to) => sendSms({ to, content: hireflixCalendarSmsContent() })
}
