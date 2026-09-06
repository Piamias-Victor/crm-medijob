// @vitest-environment node
import { describe, it, expect, vi, afterEach } from 'vitest'
import { sendResetEmail } from './send-reset-email'

const resetUrl = 'http://localhost:3000/reset-password?token=secret-raw-token'
const email = 'user@medijob.fr'
const env = {
  BREVO_API_KEY: 'xkeysib-test',
  BREVO_SENDER: 'recrutement@medijob.fr',
}

function okFetch() {
  return vi.fn().mockResolvedValue({ ok: true, text: async () => '' })
}

describe('sendResetEmail', () => {
  afterEach(() => vi.restoreAllMocks())

  it('sends the reset link to the user mailbox via Brevo', async () => {
    const fetchFn = okFetch()
    await sendResetEmail({ email, resetUrl }, { fetchFn, env })

    expect(fetchFn).toHaveBeenCalledOnce()
    const [url, init] = fetchFn.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.brevo.com/v3/smtp/email')
    const headers = init.headers as Record<string, string>
    expect(headers['api-key']).toBe(env.BREVO_API_KEY)
    const body = JSON.parse(String(init.body)) as {
      to: { email: string }[]
      htmlContent: string
      subject: string
    }
    expect(body.to).toEqual([{ email }])
    expect(body.htmlContent).toContain(resetUrl)
    expect(body.subject).toContain('mot de passe')
  })

  it('does not write the reset URL to logs', async () => {
    const info = vi.spyOn(console, 'info').mockImplementation(() => {})
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})

    await sendResetEmail({ email, resetUrl }, { fetchFn: okFetch(), env })

    const dumped = [...info.mock.calls, ...error.mock.calls, ...log.mock.calls]
      .map((call) => JSON.stringify(call))
      .join(' ')
    expect(dumped).not.toContain(resetUrl)
    expect(dumped).not.toContain('secret-raw-token')
  })

  it('fails closed when mailer env is missing', async () => {
    const fetchFn = okFetch()
    await expect(sendResetEmail({ email, resetUrl }, { fetchFn, env: {} })).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
    })
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('fails closed when Brevo rejects the send', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: false, text: async () => 'denied' })
    await expect(sendResetEmail({ email, resetUrl }, { fetchFn, env })).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
    })
  })
})
