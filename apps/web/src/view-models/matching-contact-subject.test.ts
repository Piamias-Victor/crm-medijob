// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { matchingContactSubject } from '@/view-models/matching-contact-subject'

describe('matchingContactSubject', () => {
  it('builds subject with mission title and pharmacy', () => {
    expect(matchingContactSubject('Titulaire CDI', 'Pharmacie Centrale')).toBe(
      'Mission Titulaire CDI — Pharmacie Centrale',
    )
  })
})
