import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

describe('createBadakanClient searchContracts', () => {
  it('posts contracts/search and maps status, PDF and DPAE', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [
            {
              id: 'c-lucie',
              currentStep: 'VALIDATED',
              pdfUrl: 'https://files.badakan.test/c-lucie.pdf',
              dpaeUrl: 'https://files.badakan.test/c-lucie-dpae.pdf',
              recipient: { firstName: 'Lucie', lastName: 'Robert' },
              enterprise: { enterpriseName: 'Pharmacie Hermes' },
            },
          ],
          totalPages: 1,
        }),
      })

    const rows = await testBadakanClient(fetchFn).searchContracts(20)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.status).toBe('VALIDATED')
    expect(rows[0]?.pdfUrl).toContain('c-lucie.pdf')
    expect(rows[0]?.dpaeUrl).toContain('c-lucie-dpae.pdf')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain('/services/v3/contracts/search')
    const init = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({ security_token: 'tok' })
  })
})
