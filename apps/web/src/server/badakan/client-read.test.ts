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

  it('returns null when Badakan recipient is gone (404)', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({ ok: false, status: 404, json: async () => ({}) })

    await expect(testBadakanClient(fetchFn).getRecipient('gone')).resolves.toBeNull()
  })

  it('still throws when Badakan recipient GET fails with a non-404', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ securityToken: 'tok' }),
      })
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })

    await expect(testBadakanClient(fetchFn).getRecipient('r9')).rejects.toThrow(
      'Badakan recipient failed (500)',
    )
  })

  it('exposes only Badakan read methods', () => {
    const client = testBadakanClient(vi.fn())
    expect(Object.keys(client).sort()).toEqual([
      'getComments',
      'getEnterprise',
      'getRecipient',
      'searchContracts',
      'searchEmployees',
      'searchEnterprises',
      'searchMissions',
      'searchNewEmployees',
    ])
  })
})
