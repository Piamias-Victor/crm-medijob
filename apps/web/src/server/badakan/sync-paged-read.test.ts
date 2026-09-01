import { describe, expect, it, vi } from 'vitest'
import { syncPagedRead } from './sync-paged-read'

describe('syncPagedRead', () => {
  it('upserts each search row and reports fetched count', async () => {
    const row = { badakanId: 'c-lucie' }
    const upsertFromRead = vi.fn()
    const result = await syncPagedRead({
      search: async () => [row],
      upsertFromRead,
    })
    expect(upsertFromRead).toHaveBeenCalledWith(row)
    expect(result).toEqual({ fetched: 1, upserted: 1 })
  })
})
