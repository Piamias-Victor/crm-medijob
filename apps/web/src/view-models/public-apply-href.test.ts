import { describe, expect, it } from 'vitest'
import {
  canShowPublicApplyLink,
  publicApplyPath,
  publicApplyUrl,
  spontaneousApplyPath,
  spontaneousApplyUrl,
} from '@/view-models/public-apply-href'

describe('publicApplyPath', () => {
  it('builds the public apply path from board listing id', () => {
    expect(publicApplyPath('listing-uuid')).toBe('/postuler/listing-uuid')
  })

  it('builds the spontaneous apply path without a listing id', () => {
    expect(spontaneousApplyPath()).toBe('/postuler')
    expect(spontaneousApplyUrl('https://mdj.crm.medijob.fr/')).toBe(
      'https://mdj.crm.medijob.fr/postuler',
    )
  })
})

describe('publicApplyUrl', () => {
  it('joins base url and path without double slash', () => {
    expect(publicApplyUrl('https://mdj.crm.medijob.fr/', 'listing-uuid')).toBe(
      'https://mdj.crm.medijob.fr/postuler/listing-uuid',
    )
  })
})

describe('canShowPublicApplyLink', () => {
  it('shows only for published offers with a board listing id', () => {
    expect(
      canShowPublicApplyLink({ status: 'PUBLIEE', boardListingId: 'listing-uuid' }),
    ).toBe(true)
    expect(canShowPublicApplyLink({ status: 'PUBLIEE', boardListingId: null })).toBe(false)
    expect(
      canShowPublicApplyLink({ status: 'DEPUBLIEE', boardListingId: 'listing-uuid' }),
    ).toBe(false)
  })
})
