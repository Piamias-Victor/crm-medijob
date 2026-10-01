import { describe, expect, it, vi } from 'vitest'
import { refreshJobOfferList } from '@/view-models/job-offer-list-refresh'

describe('refreshJobOfferList', () => {
  it('invalidates list then refreshes RSC', async () => {
    const invalidate = vi.fn().mockResolvedValue(undefined)
    const refresh = vi.fn()
    await refreshJobOfferList({ invalidateList: invalidate, refresh })
    expect(invalidate).toHaveBeenCalledOnce()
    expect(refresh).toHaveBeenCalledOnce()
  })
})
