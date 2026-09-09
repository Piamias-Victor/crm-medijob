import { describe, expect, it } from 'vitest'
import { sendDueInterimNeedSms } from './send-due'
import { INTERIM_NEED_SMS_CONTENT } from '@/view-models/interim-need-sms'
import { needSmsDeps, needSmsRow } from './send-due.fixtures'
import { needSmsNeed } from './match.fixtures'

describe('sendDueInterimNeedSms', () => {
  it('texts a Candidate when a matching new need appears', async () => {
    const deps = needSmsDeps({ testTo: undefined })
    const result = await sendDueInterimNeedSms(deps)
    expect(result.sent).toBe(1)
    expect(deps.sendSms).toHaveBeenCalledWith({
      to: '33612345678',
      content: INTERIM_NEED_SMS_CONTENT,
    })
    expect(deps.markSent).toHaveBeenCalledWith('c1')
  })

  it('stamps lastSentAt without texting when the Candidate was never initialized', async () => {
    const deps = needSmsDeps({
      testTo: undefined,
      listCandidates: async () => [needSmsRow({ lastSentAt: null })],
    })
    const result = await sendDueInterimNeedSms(deps)
    expect(result).toEqual({ sent: 0, skippedNoPhone: 0, skippedInit: 1, failed: 0 })
    expect(deps.sendSms).not.toHaveBeenCalled()
    expect(deps.markSent).toHaveBeenCalledWith('c1')
  })

  it('waits when the Candidate has no phone and no override', async () => {
    const deps = needSmsDeps({
      testTo: undefined,
      listCandidates: async () => [needSmsRow({ phone: null })],
    })
    const result = await sendDueInterimNeedSms(deps)
    expect(result.sent).toBe(0)
    expect(result.skippedNoPhone).toBe(1)
    expect(deps.sendSms).not.toHaveBeenCalled()
    expect(deps.markSent).not.toHaveBeenCalled()
  })

  it('sends one SMS even when several matching needs exist', async () => {
    const deps = needSmsDeps({
      testTo: undefined,
      listOpenNeeds: async () => [needSmsNeed(), needSmsNeed({ createdAt: new Date() })],
    })
    expect((await sendDueInterimNeedSms(deps)).sent).toBe(1)
    expect(deps.sendSms).toHaveBeenCalledTimes(1)
  })

  it('texts a Candidate geocoded from postal code when coords are missing', async () => {
    const deps = needSmsDeps({
      testTo: undefined,
      listCandidates: async () => [
        needSmsRow({ latitude: null, longitude: null, postalCode: '75001' }),
      ],
      lookupGeo: async (code) =>
        code === '75001' ? { lat: 48.8566, lon: 2.3522 } : null,
    })
    expect((await sendDueInterimNeedSms(deps)).sent).toBe(1)
  })
})
