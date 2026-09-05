import { describe, expect, it, vi } from 'vitest'
import { testBadakanClient } from './client-test-client'

describe('createBadakanClient searchMissions', () => {
  it('posts missions/search and maps SEARCH_APPLIED applicants', async () => {
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
              id: 'm-hermes',
              currentStep: 'CANCELLED',
              expectedStartDate: '2026-08-01',
              expectedEndDate: '2026-08-03',
              enterprise: { enterpriseName: 'Pharmacie Hermes' },
              recipients: [
                {
                  id: 'r-lucie',
                  firstName: 'Lucie',
                  lastName: 'Robert',
                  validatedPhoneNumber: '0601020304',
                  currentStep: 'SEARCH_APPLIED',
                },
              ],
            },
          ],
          totalPages: 1,
        }),
      })

    const rows = await testBadakanClient(fetchFn).searchMissions(20)
    expect(rows).toHaveLength(1)
    expect(rows[0]?.pharmacyName).toBe('Pharmacie Hermes')
    expect(rows[0]?.searchApplied[0]?.phone).toBe('0601020304')
    expect(String(fetchFn.mock.calls[1]?.[0])).toContain('/services/v3/missions/search')
    const init = fetchFn.mock.calls[1]?.[1] as RequestInit
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({ security_token: 'tok' })
  })
})
