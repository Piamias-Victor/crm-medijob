import { describe, it, expect } from 'vitest'
import { toJobOfferListRow } from '@/view-models/job-offer-list'

describe('toJobOfferListRow', () => {
  it('maps JobOffer entity to list row', () => {
    const row = toJobOfferListRow({
      id: 'o1',
      title: 'Pharmacien CDI',
      status: 'BROUILLON',
      publishedAt: null,
      latitude: null,
      longitude: null,
      city: null,
      mission: {
        id: 'm1',
        title: 'Mission CDI',
        pharmacy: { latitude: 45.7, longitude: 4.8, city: 'Lyon' },
      },
      _count: { applications: 3 },
    })
    expect(row.missionTitle).toBe('Mission CDI')
    expect(row.source).toBe('mission')
    expect(row.latitude).toBe(45.7)
    expect(row.applicationCount).toBe(3)
  })

  it('maps standalone offer without mission', () => {
    const row = toJobOfferListRow({
      id: 'o2',
      title: 'Préparateur',
      status: 'BROUILLON',
      publishedAt: null,
      latitude: 43.7,
      longitude: 7.2,
      city: 'Nice',
      mission: null,
      _count: { applications: 0 },
    })
    expect(row.source).toBe('standalone')
    expect(row.missionId).toBeNull()
    expect(row.city).toBe('Nice')
  })
})
