import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

describe('createBadakanClient', () => {
  it('logs in on /services/v3 then searches new employees', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ id: 'r1', firstName: 'Ada', lastName: 'L', email: 'a@b.c' }],
          totalPages: 1,
        }),
      })

    const rows = await testBadakanClient(fetchFn).searchNewEmployees(20)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.badakanId).toBe('r1')
    expect(String(fetchFn.mock.calls[0]?.[0])).toContain('/services/v3/accounts/login')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain(
      '/services/v3/recipients/searchNewEmployees',
    )
    const searchInit = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(searchInit.headers).toMatchObject({ security_token: 'tok' })
  })

  it('searches employees on v3 without a live network call', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ id: 'e1', firstName: 'Marie', lastName: 'App' }],
          totalPages: 1,
        }),
      })

    const rows = await testBadakanClient(fetchFn).searchEmployees(20)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.badakanId).toBe('e1')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain(
      '/services/v3/recipients/searchEmployees',
    )
    const searchInit = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(searchInit.method).toBe('POST')
    expect(searchInit.headers).toMatchObject({ security_token: 'tok' })
  })
})
