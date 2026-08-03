import { describe, it, expect } from 'vitest'
import { jobOfferStatusLabel } from './job-offer-status'

describe('jobOfferStatusLabel', () => {
  it('maps statuses to French labels', () => {
    expect(jobOfferStatusLabel('BROUILLON')).toBe('Brouillon')
    expect(jobOfferStatusLabel('PUBLIEE')).toBe('Publiée')
    expect(jobOfferStatusLabel('DEPUBLIEE')).toBe('Dépubliée')
  })
})
