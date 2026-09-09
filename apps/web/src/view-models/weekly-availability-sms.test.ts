import { describe, expect, it } from 'vitest'
import {
  availabilitySmsReminderCutoff,
  weeklyAvailabilityReminderSmsContent,
  weeklyAvailabilitySmsContent,
} from './weekly-availability-sms'

// 43-char base64url token, as produced by createRawToken()
const PROD_URL = `https://crm.medijob.fr/dispo/${'a'.repeat(43)}`

// Characters outside GSM-7 force UCS-2 encoding, which halves the segment size.
const NON_GSM7 = /[^A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅåÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]/

describe('weeklyAvailabilitySmsContent', () => {
  it('includes the secret weekly availability URL', () => {
    expect(weeklyAvailabilitySmsContent(PROD_URL)).toContain(PROD_URL)
  })

  it('announces App-validated and points to missions in the app', () => {
    expect(weeklyAvailabilitySmsContent(PROD_URL)).toMatch(
      /^Bonne nouvelle, profil MEDIJOB validé\. Consultez les missions dans l'app\. Dispos : /,
    )
  })

  it('fits a single GSM-7 segment with a production URL', () => {
    const content = weeklyAvailabilitySmsContent(PROD_URL)
    expect(content).not.toMatch(NON_GSM7)
    expect(content.length).toBeLessThanOrEqual(160)
  })
})

describe('weeklyAvailabilityReminderSmsContent', () => {
  it('asks the Candidate to refresh monthly availability', () => {
    expect(weeklyAvailabilityReminderSmsContent(PROD_URL)).toMatch(
      /^MediJob : actualisez vos dispos pour recevoir des missions : /,
    )
  })

  it('fits a single GSM-7 segment with a production URL', () => {
    const content = weeklyAvailabilityReminderSmsContent(PROD_URL)
    expect(content).toContain(PROD_URL)
    expect(content).not.toMatch(NON_GSM7)
    expect(content.length).toBeLessThanOrEqual(160)
  })
})

describe('availabilitySmsReminderCutoff', () => {
  it('is 15 days before now', () => {
    expect(availabilitySmsReminderCutoff(new Date('2026-09-09T07:00:00.000Z'))).toEqual(
      new Date('2026-08-25T07:00:00.000Z'),
    )
  })
})
