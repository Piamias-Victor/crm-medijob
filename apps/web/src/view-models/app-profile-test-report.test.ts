// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { testProcessMessage } from '@/view-models/app-profile-test-report'

describe('testProcessMessage', () => {
  it('reports the created fiche and the phone that got the SMS', () => {
    expect(
      testProcessMessage({
        ok: true,
        name: 'Maimouna Tounkara',
        sync: { created: 1, linked: 0, skipped: 0 },
        candidateId: 'c1',
        sms: 'sent',
        sentTo: '0624174724',
      }),
    ).toBe('Maimouna Tounkara : fiche créée, SMS envoyé au 0624174724.')
  })

  it('tells the tester which env var is missing', () => {
    expect(testProcessMessage({ ok: false, reason: 'test_phone_missing' })).toContain(
      'AVAILABILITY_LINK_TEST_PHONE',
    )
  })
})
