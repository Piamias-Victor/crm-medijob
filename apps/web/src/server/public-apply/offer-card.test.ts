import { describe, expect, it } from 'vitest'
import { toPublicOfferCard } from '@/server/public-apply/offer-card'

describe('toPublicOfferCard', () => {
  it('maps mission pharmacy city without reading a mission.city field', () => {
    const card = toPublicOfferCard({
      id: 'offer-1',
      boardListingId: 'listing-1',
      title: 'Préparateur CDI',
      status: 'PUBLIEE',
      city: null,
      jobTitleName: null,
      jobTitleId: null,
      contractType: null,
      jobTitle: null,
      mission: {
        contractType: 'CDI',
        jobTitle: { id: 'jt-1', name: 'Préparateur' },
        pharmacy: { city: 'Lyon' },
      },
    })
    expect(card).toMatchObject({
      boardListingId: 'listing-1',
      city: 'Lyon',
      jobTitleName: 'Préparateur',
      contractLabel: 'CDI',
    })
  })
})
