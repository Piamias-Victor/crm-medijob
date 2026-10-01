import { describe, it, expect } from 'vitest'
import { toJobOfferListRow } from '@/view-models/job-offer-list'

describe('toJobOfferListRow', () => {
  it('maps JobOffer entity to list row', () => {
    const row = toJobOfferListRow({
      id: 'o1',
      title: 'Pharmacien CDI',
      status: 'BROUILLON',
      publishedAt: null,
      mission: { id: 'm1', title: 'Mission CDI' },
      _count: { applications: 3 },
    })
    expect(row.missionTitle).toBe('Mission CDI')
    expect(row.source).toBe('mission')
    expect(row.applicationCount).toBe(3)
  })

  it('maps standalone offer without mission', () => {
    const row = toJobOfferListRow({
      id: 'o2',
      title: 'Préparateur',
      status: 'BROUILLON',
      publishedAt: null,
      mission: null,
      _count: { applications: 0 },
    })
    expect(row.source).toBe('standalone')
    expect(row.missionId).toBeNull()
  })
})
