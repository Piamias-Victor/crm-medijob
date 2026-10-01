import { describe, expect, it } from 'vitest'
import { jobOfferDetailHref } from '@/view-models/job-offer-href'

describe('jobOfferDetailHref', () => {
  it('points to offre detail page for edit and publish', () => {
    expect(jobOfferDetailHref('offer-42')).toBe('/offres/offer-42')
  })
})
