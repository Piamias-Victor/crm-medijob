import { describe, expect, it } from 'vitest'
import { buildFacturationFilterConfig } from '@/lib/filters/facturation-filter-config'
import {
  buildFacturationFilterDefaults,
  toFacturationSuiviFilters,
} from '@/lib/filters/facturation-filter-map'

const config = buildFacturationFilterConfig(
  [{ id: 'p-nord', name: 'Pharma Nord' }],
  [{ id: 'u-alice', name: 'Alice' }],
)

describe('toFacturationSuiviFilters', () => {
  it('maps contract, status, pharmacy, referent and sentAt range', () => {
    expect(
      toFacturationSuiviFilters({
        contrat: ['CDD'],
        etat: ['ENVOYE'],
        pharmacie: ['p-nord'],
        referent: ['u-alice'],
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

  it('ignores empty values', () => {
    expect(toFacturationSuiviFilters(buildFacturationFilterDefaults(config))).toEqual({})
  })
})
