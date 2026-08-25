import { describe, expect, it, vi } from 'vitest'
import { sendHireflixInviteEmail } from './send-invite-email'

const env = {
  BREVO_API_KEY: 'xkeysib-test',
  BREVO_SENDER: 'recrutement@medijob.fr',
  BREVO_TEMPLATE_ID: '206',
}

describe('sendHireflixInviteEmail', () => {
  it('sends Brevo template 206 with prénom and Hireflix URL', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
    await sendHireflixInviteEmail(
      { to: 'camille@example.com', firstName: 'Camille', url: 'https://app.hireflix.com/abc' },
      { fetchFn, env },
    )
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(String(init.body)) as {
      templateId: number
      to: { email: string }[]
      params: { PRENOM: string; HIREFLIX_URL: string }
    }
    expect(body.templateId).toBe(206)
    expect(body.to[0]?.email).toBe('camille@example.com')
    expect(body.params).toEqual({
      PRENOM: 'Camille',
      HIREFLIX_URL: 'https://app.hireflix.com/abc',
    })
  })

  it('fails closed when Brevo env is missing', async () => {
    const fetchFn = vi.fn()
    await expect(
      sendHireflixInviteEmail(
        { to: 'a@b.c', firstName: 'A', url: 'https://app.hireflix.com/x' },
        { fetchFn, env: {} },
      ),
    ).rejects.toThrow('Envoi email indisponible')
    expect(fetchFn).not.toHaveBeenCalled()
  })
})
