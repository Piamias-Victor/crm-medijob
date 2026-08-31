import { describe, expect, it, vi } from 'vitest'
import { sendAvailabilitySms } from './send'

const env = { BREVO_API_KEY: 'xkeysib-test', BREVO_SMS_SENDER: 'MediJob' }

describe('sendAvailabilitySms', () => {
  it('posts transactional SMS through injected fetch', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true, text: async () => '' })
    await sendAvailabilitySms(
      { to: '33612345678', content: 'MediJob : https://x/dispo/tok' },
      { fetchFn, env },
    )
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.brevo.com/v3/transactionalSMS/sms')
    const body = JSON.parse(String(init.body)) as {
      sender: string
      recipient: string
      content: string
    }
    expect(body).toEqual({
      sender: 'MediJob',
      recipient: '33612345678',
      content: 'MediJob : https://x/dispo/tok',
    })
  })

  it('fails closed when SMS env is missing', async () => {
    const fetchFn = vi.fn()
    await expect(
      sendAvailabilitySms({ to: '33612345678', content: 'x' }, { fetchFn, env: {} }),
    ).rejects.toThrow('Envoi SMS indisponible')
    expect(fetchFn).not.toHaveBeenCalled()
  })
})
