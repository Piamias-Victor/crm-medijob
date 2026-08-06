import { describe, expect, it, vi } from 'vitest'
import { syncAppProfiles } from './sync'

describe('syncAppProfiles', () => {
  it('upserts new recipients and skips treated badakan ids', async () => {
    const upsertPending = vi.fn()
    const result = await syncAppProfiles({
      searchNewEmployees: async () => [
        {
          badakanId: 'new',
          firstName: 'A',
          lastName: 'B',
          email: 'a@b.c',
          phone: null,
          address: null,
          city: null,
          postalCode: null,
          activityLabel: 'Pharmacien',
          hasResume: false,
          snapshot: { id: 'new' },
        },
        {
          badakanId: 'old',
          firstName: 'C',
          lastName: 'D',
          email: null,
          phone: null,
          address: null,
          city: null,
          postalCode: null,
          activityLabel: null,
          hasResume: false,
          snapshot: { id: 'old' },
        },
      ],
      findByBadakanIds: async () => [{ badakanId: 'old', status: 'IGNORE' }],
      upsertPending,
      findJobTitleIdByName: async () => 'jt1',
    })
    expect(result).toEqual({ fetched: 2, upserted: 1, skippedTreated: 1 })
    expect(upsertPending).toHaveBeenCalledTimes(1)
    expect(upsertPending.mock.calls[0]?.[0]).toMatchObject({
      badakanId: 'new',
      jobTitleId: 'jt1',
    })
  })
})
