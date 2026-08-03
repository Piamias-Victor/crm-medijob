import { describe, expect, it } from 'vitest'
import { buildContactFilterConfig } from '@/lib/filters/contact-filter-config'
import { buildContactFilterDefaults, toContactListFilters } from '@/lib/filters/contact-filter-map'

const config = buildContactFilterConfig(
  [{ id: 'p1', name: 'Pharmacie du Centre' }],
  [{ id: 'r1', name: 'Titulaire' }],
  [{ id: 'u1', name: 'Alice' }],
)

describe('toContactListFilters', () => {
  it('mappe fonction, pharmacie, ville, département, statut, principal et référent', () => {
    expect(
      toContactListFilters({
        fonction: ['r1'],
        pharmacie: ['p1'],
        ville: '  Lyon  ',
        departement: ['69'],
        statutPharmacie: ['PROSPECT'],
        principal: true,
        referent: ['u1'],
      }),
    ).toEqual({
      contactRoleIds: ['r1'],
      pharmacyIds: ['p1'],
      city: 'Lyon',
      departments: ['69'],
      pharmacyStatuses: ['PROSPECT'],
      isPrimary: true,
      referentIds: ['u1'],
    })
  })

  it('ignore valeurs vides', () => {
    expect(toContactListFilters(buildContactFilterDefaults(config))).toEqual({})
  })
})
