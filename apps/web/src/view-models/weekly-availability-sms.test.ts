import { describe, expect, it } from 'vitest'
import { weeklyAvailabilitySmsContent } from './weekly-availability-sms'

describe('weeklyAvailabilitySmsContent', () => {
  it('includes the secret weekly availability URL', () => {
    expect(weeklyAvailabilitySmsContent('http://localhost:3000/dispo/tok')).toContain(
      'http://localhost:3000/dispo/tok',
    )
  })
})
