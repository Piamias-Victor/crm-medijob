import { describe, expect, it } from 'vitest'
import { buildContactFilterConfig } from '@/lib/filters/contact-filter-config'
import { buildContactFilterDefaults, toContactListFilters } from '@/lib/filters/contact-filter-map'

const config = buildContactFilterConfig([{ id: 'p1', name: 'Pharmacie du Centre' }])

describe('toContactListFilters', () => {
  it('mappe rôle, pharmacie, département, statut et principal', () => {
    expect(
      toContactListFilters({
        role: ['TITULAIRE'],
        pharmacie: ['p1'],
        departement: ['69'],
        statutPharmacie: ['PROSPECT'],
        principal: true,
      }),
    ).toEqual({
      roles: ['TITULAIRE'],
      pharmacyIds: ['p1'],
      departments: ['69'],
      pharmacyStatuses: ['PROSPECT'],
      isPrimary: true,
    })
  })

  it('ignore valeurs vides', () => {
    expect(toContactListFilters(buildContactFilterDefaults(config))).toEqual({})
  })
})
