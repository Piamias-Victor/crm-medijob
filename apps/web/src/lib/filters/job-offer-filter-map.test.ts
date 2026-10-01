import { describe, expect, it } from 'vitest'
import { toJobOfferListFilters } from '@/lib/filters/job-offer-filter-map'
import { buildJobOfferFilterConfig } from '@/lib/filters/job-offer-filter-config'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'

describe('toJobOfferListFilters', () => {
  it('maps statut publié / dépublié and city', () => {
    const config = buildJobOfferFilterConfig([], [], [])
    const values = {
      ...buildDefaultFilterValues(config),
      statut: ['PUBLIEE', 'DEPUBLIEE'],
      ville: 'Nice',
    }
    expect(toJobOfferListFilters(values)).toEqual({
      statuses: ['PUBLIEE', 'DEPUBLIEE'],
      city: 'Nice',
    })
  })
})
