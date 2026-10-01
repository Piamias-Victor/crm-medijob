import { describe, expect, it, vi } from 'vitest'
import { handleCreateStandaloneOffer } from '@/server/routers/job-offer-standalone'

describe('handleCreateStandaloneOffer', () => {
  it('creates draft when city geocodes', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'o1' })
    const result = await handleCreateStandaloneOffer(
      { create, lookupGeo: vi.fn().mockResolvedValue({ lat: 43.7, lon: 7.2 }) },
      {
        jobTitleId: 'jt1',
        jobTitleName: 'Pharmacien',
        city: 'Nice',
        contractType: 'CDI',
        tempsPlein: true,
      },
    )
    expect(result.id).toBe('o1')
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Pharmacien',
        city: 'Nice',
        latitude: 43.7,
        longitude: 7.2,
      }),
    )
  })

  it('rejects non-geocodable city', async () => {
    await expect(
      handleCreateStandaloneOffer(
        { create: vi.fn(), lookupGeo: vi.fn().mockResolvedValue(null) },
        {
          jobTitleId: 'jt1',
          jobTitleName: 'Pharmacien',
          city: 'Zzztown',
          contractType: 'CDI',
          tempsPlein: true,
        },
      ),
    ).rejects.toMatchObject({ code: 'BAD_REQUEST' })
  })
})
