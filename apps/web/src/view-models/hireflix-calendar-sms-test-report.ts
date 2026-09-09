import type { CalendarSmsTestResult } from '@/server/app-profile/hireflix-calendar-sms-test'

const FAILURES: Record<Extract<CalendarSmsTestResult, { ok: false }>['reason'], string> = {
  disabled: 'SMS créneau indisponible en production.',
  test_phone_missing: 'Renseigne HIREFLIX_CALENDAR_SMS_TEST_PHONE avant de lancer un test.',
  invalid_phone: 'Numéro de test invalide.',
}

export function calendarSmsTestMessage(result: CalendarSmsTestResult): string {
  if (result.ok) return `SMS créneau envoyé au ${result.sentTo}.`
  return FAILURES[result.reason]
}
