// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { runAppValidatedTest } from './test-one'
import type { TestOneDeps } from './test-one'

const recipient = mapBadakanRecipient({
  id: 'bk-1',
  firstName: 'Maimouna',
  lastName: 'Tounkara',
  phone: '0611111111',
})!

function stubDeps(overrides: Partial<TestOneDeps> = {}): TestOneDeps {
  return {
    testPhone: '0624174724',
    getRecipient: async () => recipient,
    syncValidated: async () => ({ created: 1, linked: 0, skipped: 0 }),
    findCandidate: async () => ({ id: 'c-new' }),
    sendAvailabilitySms: async () => 'sent',
    ...overrides,
  }
}

describe('runAppValidatedTest', () => {
  it('syncs the Badakan profile then texts the availability link', async () => {
    const deps = stubDeps()
    expect(await runAppValidatedTest('bk-1', deps)).toEqual({
      ok: true,
      name: 'Maimouna Tounkara',
      sync: { created: 1, linked: 0, skipped: 0 },
      candidateId: 'c-new',
      sms: 'sent',
      sentTo: '0624174724',
    })
  })

  it('refuses to run without a test phone, so no real Candidate is texted', async () => {
    const sendAvailabilitySms = vi.fn()
    const result = await runAppValidatedTest(
      'bk-1',
      stubDeps({ testPhone: undefined, sendAvailabilitySms }),
    )
    expect(result).toEqual({ ok: false, reason: 'test_phone_missing' })
    expect(sendAvailabilitySms).not.toHaveBeenCalled()
  })

  it('reports an unknown Badakan profile', async () => {
    expect(await runAppValidatedTest('bk-1', stubDeps({ getRecipient: async () => null }))).toEqual({
      ok: false,
      reason: 'recipient_missing',
    })
  })

  it('reports when the sync produced no Candidate', async () => {
    const result = await runAppValidatedTest('bk-1', stubDeps({ findCandidate: async () => null }))
    expect(result).toEqual({ ok: false, reason: 'candidate_missing' })
  })
})
