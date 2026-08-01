import { describe, expect, it } from 'vitest'
import { buildContactFilterConfig } from '@/lib/filters/contact-filter-config'
import { buildContactFilterDefaults, toContactListFilters } from '@/lib/filters/contact-filter-map'

const config = buildContactFilterConfig(
  [{ id: 'p1', name: 'Pharmacie du Centre' }],
  [{ id: 'u1', name: 'Alice' }],
)

describe('toContactListFilters', () => {
  it('mappe rôle, pharmacie, département, statut, principal et référent', () => {
    expect(
      toContactListFilters({
        role: ['TITULAIRE'],
        pharmacie: ['p1'],
        departement: ['69'],
        statutPharmacie: ['PROSPECT'],
        principal: true,
        referent: ['u1'],
      }),
    ).toEqual({
      roles: ['TITULAIRE'],
      pharmacyIds: ['p1'],
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
