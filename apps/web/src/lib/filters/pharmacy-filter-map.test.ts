// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { buildPharmacyFilterConfig } from '@/lib/filters/pharmacy-filter-config'
import { toPharmacyListFilters } from '@/lib/filters/pharmacy-filter-map'

const config = buildPharmacyFilterConfig({
  groupements: [{ id: 'g1', name: 'Giphar' }],
  softwares: [{ id: 'sw1', name: 'Winpharma' }],
  recruiters: [{ id: 'u1', name: 'Alice' }],
})
const defaults = buildDefaultFilterValues(config)

describe('toPharmacyListFilters', () => {
  it('mappe statut, ville, région, département, mission, groupement, LGO et référent', () => {
    expect(
      toPharmacyListFilters({
        ...defaults,
        statut: ['ACTIF'],
        ville: '  Lyon  ',
        region: ['ARA'],
        departement: ['69'],
        missionActive: true,
        groupement: ['g1'],
        logiciel: ['sw1'],
        referent: ['u1'],
      }),
    ).toEqual({
      statuses: ['ACTIF'],
      city: 'Lyon',
      regionIds: ['ARA'],
      departments: ['69'],
      activeMission: true,
      groupementIds: ['g1'],
      softwareIds: ['sw1'],
      referentIds: ['u1'],
    })
  })

  it('omet les tableaux vides, ville blanche et booléens null', () => {
    expect(toPharmacyListFilters({ ...defaults, ville: '   ' })).toEqual({})
  })
})
