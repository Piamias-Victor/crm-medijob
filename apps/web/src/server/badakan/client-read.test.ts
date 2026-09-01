import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

describe('createBadakanClient reads', () => {
  it('gets one recipient by id with GET', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 'r9', firstName: 'Ada', lastName: 'L' }),
      })

    const row = await testBadakanClient(fetchFn).getRecipient('r9')
    expect(row?.badakanId).toBe('r9')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain('/services/v3/recipients/r9')
    const init = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(init.method ?? 'GET').toBe('GET')
    expect(init.headers).toMatchObject({ security_token: 'tok' })
  })

  it('exposes only Badakan read methods', () => {
    const client = testBadakanClient(vi.fn())
    expect(Object.keys(client).sort()).toEqual([
      'getComments',
      'getEnterprise',
      'getRecipient',
      'searchEmployees',
      'searchMissions',
      'searchNewEmployees',
    ])
  })
})
