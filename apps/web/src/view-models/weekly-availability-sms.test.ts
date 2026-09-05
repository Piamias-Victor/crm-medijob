import { describe, expect, it } from 'vitest'
import { weeklyAvailabilitySmsContent } from './weekly-availability-sms'

// 43-char base64url token, as produced by createRawToken()
const PROD_URL = `https://crm.medijob.fr/dispo/${'a'.repeat(43)}`

// Characters outside GSM-7 force UCS-2 encoding, which halves the segment size.
const NON_GSM7 = /[^A-Za-z0-9 \r\n@£$¥èéùìòÇØøÅåÆæßÉ!"#¤%&'()*+,\-./:;<=>?¡ÄÖÑÜ§¿äöñüà^{}\\[~\]|€]/

describe('weeklyAvailabilitySmsContent', () => {
  it('includes the secret weekly availability URL', () => {
    expect(weeklyAvailabilitySmsContent(PROD_URL)).toContain(PROD_URL)
  })

  it('pitches the agency before asking for availability', () => {
    expect(weeklyAvailabilitySmsContent(PROD_URL)).toMatch(/^MediJob : /)
  })

  it('fits a single GSM-7 segment with a production URL', () => {
    const content = weeklyAvailabilitySmsContent(PROD_URL)
    expect(content).not.toMatch(NON_GSM7)
    expect(content.length).toBeLessThanOrEqual(160)
  })
})
