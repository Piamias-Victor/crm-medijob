import { describe, expect, it } from 'vitest'
import { filterOffersBySource, toJobOfferMapPins } from '@/view-models/job-offer-map'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

const rows: JobOfferListRow[] = [
  {
    id: 'o1',
    title: 'Pharmacien',
    status: 'BROUILLON',
    publishedAt: null,
    missionId: 'm1',
    missionTitle: 'M',
    source: 'mission',
    applicationCount: 0,
    latitude: 45.7,
    longitude: 4.8,
    city: 'Lyon',
  },
  {
    id: 'o2',
    title: 'Préparateur',
    status: 'BROUILLON',
    publishedAt: null,
    missionId: null,
    missionTitle: null,
    source: 'standalone',
    applicationCount: 0,
    latitude: 43.7,
    longitude: 7.2,
    city: 'Nice',
  },
]

describe('job-offer-map', () => {
  it('filters by source', () => {
    expect(filterOffersBySource(rows, 'mission')).toHaveLength(1)
    expect(filterOffersBySource(rows, 'standalone')).toHaveLength(1)
    expect(filterOffersBySource(rows, 'all')).toHaveLength(2)
  })

  it('builds pins for geocoded offers', () => {
    expect(toJobOfferMapPins(rows)).toHaveLength(2)
  })
})
