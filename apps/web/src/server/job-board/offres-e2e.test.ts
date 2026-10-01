import { describe, expect, it, vi } from 'vitest'
import { handleCreateStandaloneOffer } from '@/server/routers/job-offer-standalone'
import { runJobOfferGenerate } from '@/server/ai/job-offer-generate'
import { mockProvider } from '@/server/ai/mock-provider'
import { OFFER_SECTION_TITLES } from '@/server/job-board/offer-section-titles'
import { filterOffersBySource } from '@/view-models/job-offer-map'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

describe('offres e2e (mocked board + AI)', () => {
  it('standalone create → generate yields 4 HTML sections', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'o1' })
    await handleCreateStandaloneOffer(
      { create, lookupGeo: vi.fn().mockResolvedValue({ lat: 43.7, lon: 7.2 }) },
      {
        jobTitleId: 'jt1',
        jobTitleName: 'Pharmacien',
        city: 'Nice',
        contractType: 'CDI',
        tempsPlein: true,
      },
    )
    const created = create.mock.calls[0]?.[0] as { content: string }
    for (const title of OFFER_SECTION_TITLES) {
      expect(created.content).toContain(title)
    }
    const draft = await runJobOfferGenerate(mockProvider, {
      title: 'x',
      description: null,
      contractType: 'CDI',
      startDate: new Date(),
      planning: null,
      salaireMin: null,
      salaireMax: null,
      salaireNotes: null,
      heuresParSemaine: null,
      profilRecherche: null,
      notes: null,
      jobTitle: { name: 'Pharmacien' },
      pharmacy: { name: 'P', city: 'Nice', notes: null, software: null },
    })
    for (const title of OFFER_SECTION_TITLES) {
      expect(draft.content).toContain(title)
    }
  })

  it('Liste/Carte source filter separates pins', () => {
    const rows: JobOfferListRow[] = [
      {
        id: '1',
        title: 'A',
        status: 'BROUILLON',
        publishedAt: null,
        missionId: 'm',
        missionTitle: 'M',
        source: 'mission',
        applicationCount: 0,
        latitude: 1,
        longitude: 2,
        city: 'Lyon',
      },
      {
        id: '2',
        title: 'B',
        status: 'BROUILLON',
        publishedAt: null,
        missionId: null,
        missionTitle: null,
        source: 'standalone',
        applicationCount: 0,
        latitude: 3,
        longitude: 4,
        city: 'Nice',
      },
    ]
    expect(filterOffersBySource(rows, 'mission')).toHaveLength(1)
    expect(filterOffersBySource(rows, 'standalone')).toHaveLength(1)
  })
})
