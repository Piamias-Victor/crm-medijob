import { describe, expect, it } from 'vitest'
import { intakeBookingSmsLabel } from './app-profile-intake-booking-sms'

describe('intakeBookingSmsLabel', () => {
  it('marks Intake booking SMS as sent when calendarSmsSentAt is set', () => {
    expect(intakeBookingSmsLabel(new Date('2026-09-01T00:00:00.000Z'))).toBe('Envoyé')
  })

  it('shows empty cell when Intake booking SMS was never sent', () => {
    expect(intakeBookingSmsLabel(null)).toBe('—')
  })
})
