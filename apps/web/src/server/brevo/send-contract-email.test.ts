import { describe, expect, it, vi } from 'vitest'
import { sendPharmacyContractEmail } from './send-contract-email'

const env = {
  BREVO_API_KEY: 'xkeysib-test',
  BREVO_SENDER: 'recrutement@medijob.fr',
  BREVO_PHARMACY_CONTRACT_TEMPLATE_ID: '231',
}

describe('sendPharmacyContractEmail', () => {
  it('upserts pharmacy contact PRENOM then sends Brevo template 231', async () => {
    const fetchFn = vi.fn().mockResolvedValue({ ok: true, text: async () => '' })
    await sendPharmacyContractEmail(
      {
        to: ['officine@example.com', 'marie@example.com'],
        firstName: 'Marie',
      },
      { fetchFn, env },
    )
    const bodies = fetchFn.mock.calls.map(([, init]) =>
      JSON.parse(String((init as RequestInit).body)),
    )
    expect(bodies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          email: 'officine@example.com',
          attributes: { PRENOM: 'Marie' },
          updateEnabled: true,
        }),
        expect.objectContaining({
          templateId: 231,
          to: [
            { email: 'officine@example.com' },
            { email: 'marie@example.com' },
          ],
        }),
      ]),
    )
  })

  it('fails closed when Brevo env is missing', async () => {
    const fetchFn = vi.fn()
    await expect(
      sendPharmacyContractEmail(
        { to: ['a@b.c'], firstName: 'Marie' },
        { fetchFn, env: {} },
      ),
    ).rejects.toThrow('Envoi email indisponible')
    expect(fetchFn).not.toHaveBeenCalled()
  })
})
