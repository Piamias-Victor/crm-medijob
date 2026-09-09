import { describe, expect, it } from 'vitest'
import {
  HIREFLIX_CALENDAR_SMS_URL,
  hireflixCalendarSmsContent,
} from './hireflix-calendar-sms'

describe('hireflixCalendarSmsContent', () => {
  it('is the welcome booking SMS with the Google Calendar URL', () => {
    expect(hireflixCalendarSmsContent()).toBe(
      'Bienvenue chez MEDIJOB : réservez un RDV pour valider votre profil et accéder aux missions. Créneaux 7h30-20h30 : https://calendar.app.google/Xi14JMbKF3wg3b7s8',
    )
    expect(HIREFLIX_CALENDAR_SMS_URL).toBe(
      'https://calendar.app.google/Xi14JMbKF3wg3b7s8',
    )
  })
})
