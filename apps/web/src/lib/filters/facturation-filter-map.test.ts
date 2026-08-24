import { describe, expect, it } from 'vitest'
import {
  buildFacturationFilterConfig,
  buildFacturationOverviewFilterConfig,
} from '@/lib/filters/facturation-filter-config'
import {
  buildFacturationFilterDefaults,
  buildFacturationOverviewFilterDefaults,
  toFacturationOverviewFilters,
  toFacturationSuiviFilters,
} from '@/lib/filters/facturation-filter-map'

const pharmacies = [{ id: 'p-nord', name: 'Pharma Nord' }]
const recruiters = [{ id: 'u-alice', name: 'Alice' }]
const config = buildFacturationFilterConfig(pharmacies, recruiters)
const overviewConfig = buildFacturationOverviewFilterConfig(pharmacies, recruiters)

describe('toFacturationSuiviFilters', () => {
  it('maps contract, status, pharmacy, referent and sentAt range', () => {
    expect(
      toFacturationSuiviFilters({
        contrat: ['CDD'],
        etat: ['ENVOYE'],
        pharmacie: ['p-nord'],
        referent: ['u-alice'],
        annulation: '',
        periode: { from: '2026-08-01', to: '2026-08-31' },
      }),
    ).toEqual({
      contractTypes: ['CDD'],
      commercialStatuses: ['ENVOYE'],
      pharmacyIds: ['p-nord'],
      referentIds: ['u-alice'],
      sentFrom: '2026-08-01',
      sentTo: '2026-08-31',
    })
  })

  it('maps Annulés to cancelled lines only', () => {
    expect(
      toFacturationSuiviFilters({
        contrat: [],
        etat: [],
        pharmacie: [],
        referent: [],
        annulation: 'CANCELLED',
        periode: { from: '', to: '' },
      }),
    ).toEqual({ cancelled: true })
  })

  it('ignores empty values', () => {
    expect(toFacturationSuiviFilters(buildFacturationFilterDefaults(config))).toEqual({})
  })
})

describe('toFacturationOverviewFilters', () => {
  it('maps the date range to acceptedAt', () => {
    expect(
      toFacturationOverviewFilters({
        contrat: [],
        etat: [],
        pharmacie: [],
        referent: [],
        annulation: '',
        acceptation: { from: '2026-08-01', to: '2026-08-31' },
      }),
    ).toEqual({ acceptedFrom: '2026-08-01', acceptedTo: '2026-08-31' })
  })

  it('defaults empty overview dates to the current month', () => {
    expect(buildFacturationOverviewFilterDefaults(overviewConfig, new Date(2026, 7, 20))).toEqual(
      expect.objectContaining({ acceptation: { from: '2026-08-01', to: '2026-08-31' } }),
    )
  })
})
