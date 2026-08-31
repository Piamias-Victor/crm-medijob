import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { syncAppValidated } from './sync-validated'
import { marieMoved, stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated field merge', () => {
  it('updates identity address contact job when Badakan is non-empty', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({ id: 'c-existing' }),
      mapJobTitleId: async () => 'jt-pharma',
    })
    await syncAppValidated([marieMoved], deps)
    expect(deps.patchIdentity).toHaveBeenCalledWith('c-existing', {
      firstName: 'Marie',
      lastName: 'Dupont',
      email: 'new@app.fr',
      phone: '0611111111',
      address: '12 rue Test',
      city: 'Lyon',
      postalCode: '69001',
      jobTitleId: 'jt-pharma',
    })
  })

  it('leaves CRM phone unchanged when Badakan phone is empty', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({ id: 'c-existing' }),
    })
    const noPhone = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      email: 'marie@app.fr',
      address: { address1: '12 rue Test', city: 'Lyon', zipCode: '69001' },
    })!
    await syncAppValidated([noPhone], deps)
    const patch = vi.mocked(deps.patchIdentity).mock.calls[0]?.[1]
    expect(patch).toBeDefined()
    expect(patch).not.toHaveProperty('phone')
    expect(patch).not.toHaveProperty('jobTitleId')
    expect(patch?.address).toBe('12 rue Test')
  })

  it('does not patch salary software mobility availableFrom or notes', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({ id: 'c-existing' }),
    })
    await syncAppValidated([marieMoved], deps)
    const patch = vi.mocked(deps.patchIdentity).mock.calls[0]?.[1]
    expect(patch).toBeDefined()
    for (const key of [
      'salaryExpectations',
      'salaryMin',
      'salaryMax',
      'softwareIds',
      'mobilityRadiusKm',
      'mobilityNotes',
      'availableFrom',
      'notes',
    ]) {
      expect(patch).not.toHaveProperty(key)
    }
  })

  it('leaves CRM job when Badakan activity does not map', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({ id: 'c-existing' }),
      mapJobTitleId: async () => null,
    })
    await syncAppValidated([marieMoved], deps)
    const patch = vi.mocked(deps.patchIdentity).mock.calls[0]?.[1]
    expect(patch).not.toHaveProperty('jobTitleId')
    expect(patch?.address).toBe('12 rue Test')
  })
})
