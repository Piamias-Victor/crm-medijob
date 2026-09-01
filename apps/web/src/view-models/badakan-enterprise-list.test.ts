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
  })
})
