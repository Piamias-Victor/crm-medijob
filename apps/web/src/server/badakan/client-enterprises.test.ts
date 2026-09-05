import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

const hermesRaw = {
  id: 'ent-hermes',
  enterpriseName: 'Pharmacie Hermes',
  siret: '12345678901234',
  address: { address1: '1 rue de la Paix', city: 'Paris', zipCode: '75001' },
  users: [
    {
      firstName: 'Dominique',
      lastName: 'Litzler',
      email: 'd.litzler@hermes.fr',
      phone: '0601020304',
      principal: true,
    },
  ],
}

describe('createBadakanClient getEnterprise', () => {
  it('gets one enterprise by id with GET', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => hermesRaw,
      })

    const row = await testBadakanClient(fetchFn).getEnterprise('ent-hermes')
    expect(row).toMatchObject({
      badakanId: 'ent-hermes',
      name: 'Pharmacie Hermes',
      siret: '12345678901234',
      address: '1 rue de la Paix',
      city: 'Paris',
      postalCode: '75001',
      principal: {
        firstName: 'Dominique',
        lastName: 'Litzler',
        email: 'd.litzler@hermes.fr',
        phone: '0601020304',
      },
    })
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain(
      '/services/v3/enterprises/ent-hermes',
    )
    const init = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(init.method ?? 'GET').toBe('GET')
    expect(init.headers).toMatchObject({ security_token: 'tok' })
  })
})
