// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { unpublishOfferForClosedMission } from '@/server/job-board/unpublish-on-close'

describe('unpublishOfferForClosedMission', () => {
  it('unpublishes a published JobOffer', async () => {
    const unpublish = vi.fn()
    await unpublishOfferForClosedMission(
      {
        findByMissionId: vi.fn().mockResolvedValue({
          id: 'o1',
          status: 'PUBLIEE',
          title: 'Offre',
          content: 'x'.repeat(120),
          boardListingId: 'board-uuid',
        }),
        unpublish,
      },
      'm1',
    )
    expect(unpublish).toHaveBeenCalledWith('o1')
  })

  it('skips when no published JobOffer exists', async () => {
    const unpublish = vi.fn()
    await unpublishOfferForClosedMission(
      {
        findByMissionId: vi.fn().mockResolvedValue({
          id: 'o1',
          status: 'BROUILLON',
          title: 'Offre',
          content: 'x'.repeat(120),
          boardListingId: null,
        }),
        unpublish,
      },
      'm1',
    )
    expect(unpublish).not.toHaveBeenCalled()
  })
})
