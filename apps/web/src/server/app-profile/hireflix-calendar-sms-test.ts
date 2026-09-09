import { toSmsRecipient } from '@/lib/phone-normalize'

export type CalendarSmsTestResult =
  | { ok: true; sentTo: string }
  | { ok: false; reason: 'disabled' | 'test_phone_missing' | 'invalid_phone' }

export async function sendHireflixCalendarSmsTest(input: {
  production: boolean
  testPhone?: string
  send: (to: string) => Promise<void>
}): Promise<CalendarSmsTestResult> {
  if (input.production) return { ok: false, reason: 'disabled' }
  const raw = input.testPhone?.trim()
  if (!raw) return { ok: false, reason: 'test_phone_missing' }
  const to = toSmsRecipient(raw)
  if (!to) return { ok: false, reason: 'invalid_phone' }
  await input.send(to)
  return { ok: true, sentTo: to }
}
