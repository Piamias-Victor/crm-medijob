import { describe, expect, it } from 'vitest'
import { INTERIM_NEED_SMS_CONTENT, INTERIM_NEED_SMS_RADIUS_KM } from './interim-need-sms'

describe('interim need SMS copy', () => {
  it('points the Candidate to the Medijob app', () => {
    expect(INTERIM_NEED_SMS_RADIUS_KM).toBe(80)
    expect(INTERIM_NEED_SMS_CONTENT).toContain('application MEDIJOB')
  })
})
