import { describe, expect, it, vi } from 'vitest'
import { createBadakanClient } from './client'

describe('createBadakanClient', () => {
  it('logs in then searches new employees', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ security_token: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          content: [{ id: 'r1', firstName: 'Ada', lastName: 'L', email: 'a@b.c' }],
        }),
      })

    const client = createBadakanClient({
      baseUrl: 'https://api.example/brother-web',
      email: 'u@x.com',
      password: 'secret',
      fetchFn: fetchFn as unknown as typeof fetch,
    })

    const rows = await client.searchNewEmployees(20)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.badakanId).toBe('r1')
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(String(fetchFn.mock.calls[0]?.[0])).toContain('/accounts/login')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain('/recipients/searchNewEmployees')
  })
})
