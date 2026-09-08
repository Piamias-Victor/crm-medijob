import { describe, expect, it } from 'vitest'
import { toBadakanEnterpriseListItem } from './badakan-enterprise-list'

describe('toBadakanEnterpriseListItem', () => {
  it('links a pending enterprise to the verification screen', () => {
    const item = toBadakanEnterpriseListItem({
      id: 'row1',
      name: 'Pharmacie Hermes',
      siret: '12345678901234',
      city: 'Paris',
    })
    expect(item.name).toBe('Pharmacie Hermes')
    expect(item.siretLabel).toBe('12345678901234')
    expect(item.href).toBe('/interim/officines/row1')
    expect(item.blockLabel).toBe('Prêt')
  })

  it('flags a missing SIRET so recruiters can fix it in the queue', () => {
    const item = toBadakanEnterpriseListItem({
      id: 'row1',
      name: 'Pharmacie Hermes',
      siret: null,
      city: 'Paris',
    })
    expect(item.blockLabel).toBe('SIRET manquant')
    expect(item.blockKind).toBe('missing_siret')
  })

  it('flags a SIRET already used by a CRM pharmacie', () => {
    const item = toBadakanEnterpriseListItem(
      {
        id: 'row1',
        name: 'Pharmacie Hermes',
        siret: '12345678901234',
        city: 'Paris',
      },
      { id: 'p-exist', name: 'Hermes CRM' },
    )
    expect(item.blockLabel).toBe('SIRET déjà dans le CRM')
    expect(item.blockKind).toBe('siret_taken')
  })
})

