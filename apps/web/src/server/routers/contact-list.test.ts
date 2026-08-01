// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { contactCaller, makeContactDeps } from '@/server/routers/contact.test.fixtures'

describe('contactRouter list', () => {
  it('returns list rows mapped to SPEC columns', async () => {
    const rows = await contactCaller(makeContactDeps()).list()
    expect(rows[0]).toMatchObject({
      firstName: 'Marie',
      lastName: 'Curie',
      pharmacyName: 'Pharmacie du Centre',
      roleName: 'Titulaire',
      isPrimary: true,
      department: '69',
    })
  })

  it('forwards list filters to repository', async () => {
    const deps = makeContactDeps()
    await contactCaller(deps).list({ isPrimary: true, pharmacyStatuses: ['PROSPECT'] })
    expect(deps.contacts.list).toHaveBeenCalledWith({
      isPrimary: true,
      pharmacyStatuses: ['PROSPECT'],
    })
  })
})
