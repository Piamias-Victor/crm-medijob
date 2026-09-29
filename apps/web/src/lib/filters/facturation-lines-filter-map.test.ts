import { describe, expect, it } from 'vitest'
import { buildFacturationLinesFilterConfig } from '@/lib/filters/facturation-lines-filter-config'
import {
  buildFacturationLinesFilterDefaults,
  toFacturationLineListFilters,
} from '@/lib/filters/facturation-lines-filter-map'

const config = buildFacturationLinesFilterConfig(
  [{ id: 'p-nord', name: 'Pharma Nord' }],
  [{ id: 'u-alice', name: 'Alice' }],
  new Date(Date.UTC(2026, 7, 24)),
)

describe('toFacturationLineListFilters', () => {
  it('maps search, month, CDD/CDI and actifs onto Placement filters', () => {
    expect(
      toFacturationLineListFilters('PLACEMENT', {
        recherche: 'Nord',
        mois: '2026-08',
        contrat: ['CDI'],
        pharmacie: ['p-nord'],
        referent: ['u-alice'],
        annulation: 'ACTIVE',
        liaison: 'ALL',
        periode: { from: '', to: '' },
      }),
    ).toEqual({
      kind: 'PLACEMENT',
      search: 'Nord',
      month: '2026-08',
      contractTypes: ['CDI'],
      pharmacyIds: ['p-nord'],
      referentIds: ['u-alice'],
      cancelled: false,
    })
  })

  it('defaults Placements to actifs only', () => {
    expect(toFacturationLineListFilters('PLACEMENT', buildFacturationLinesFilterDefaults(config))).toEqual({
      kind: 'PLACEMENT',
      cancelled: false,
    })
  })

  it('maps liaison Non liées to unlinkedOnly', () => {
    expect(
      toFacturationLineListFilters('PLACEMENT', {
        ...buildFacturationLinesFilterDefaults(config),
        liaison: 'UNLINKED',
      }),
    ).toMatchObject({ unlinkedOnly: true })
  })

  it('maps periode date range onto acceptedFrom/acceptedTo', () => {
    expect(
      toFacturationLineListFilters('INTERIM', {
        ...buildFacturationLinesFilterDefaults(config),
        periode: { from: '2026-01-01', to: '2026-09-30' },
      }),
    ).toMatchObject({
      kind: 'INTERIM',
      acceptedFrom: '2026-01-01',
      acceptedTo: '2026-09-30',
    })
  })
})
