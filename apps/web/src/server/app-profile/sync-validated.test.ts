import { describe, expect, it } from 'vitest'
import { syncAppValidated } from './sync-validated'
import { marieValidated, stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated', () => {
  it('creates Candidate origin App status Nouveau', async () => {
    const deps = stubValidatedDeps()
    const result = await syncAppValidated([marieValidated], deps)
    expect(result).toEqual({ created: 1, linked: 0, skipped: 0 })
    expect(deps.createAppCandidate).toHaveBeenCalledWith({
      firstName: 'Marie',
      lastName: 'App',
      email: 'marie@app.fr',
      phone: '0600000001',
      address: null,
      city: null,
      postalCode: null,
      jobTitleId: 'jt1',
      origin: 'APP',
      status: 'NOUVEAU',
      badakanId: 'bk-marie',
    })
  })

  it('links existing Candidate by email instead of creating a second', async () => {
    const deps = stubValidatedDeps({
      findMatch: async () => ({
        id: 'c-qualifie',
        firstName: 'Marie',
        lastName: 'App',
        email: 'marie@app.fr',
        phone: '0600000001',
      }),
    })
    const result = await syncAppValidated([marieValidated], deps)
    expect(result).toEqual({ created: 0, linked: 1, skipped: 0 })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.linkAppOrigin).toHaveBeenCalledWith('c-qualifie', 'bk-marie')
    expect(deps.patchIdentity).toHaveBeenCalledWith('c-qualifie', {
      firstName: 'Marie',
      lastName: 'App',
      email: 'marie@app.fr',
      phone: '0600000001',
    })
  })

  it('removes matching AppProfile from inbox without IGNORE', async () => {
    const deps = stubValidatedDeps({
      findAppProfileByBadakanId: async () => ({ id: 'p1', status: 'EN_ATTENTE' }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.markAppValidated).toHaveBeenCalledWith('p1', 'c-new')
  })

  it('skips recipient already linked by badakanId', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({ id: 'c-existing' }),
      findAppProfileByBadakanId: async () => ({ id: 'p1', status: 'EN_ATTENTE' }),
    })
    const result = await syncAppValidated([marieValidated], deps)
    expect(result).toEqual({ created: 0, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.linkAppOrigin).not.toHaveBeenCalled()
    expect(deps.markAppValidated).toHaveBeenCalledWith('p1', 'c-existing')
  })
})
