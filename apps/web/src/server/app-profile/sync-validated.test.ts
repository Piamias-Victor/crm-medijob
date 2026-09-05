import { describe, expect, it, vi } from 'vitest'
import { syncAppValidated } from './sync-validated'
import {
  marieValidated,
  marieMoved,
  stubValidatedDeps,
  existingLinked,
} from './sync-validated.fixtures'

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
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'EN_ATTENTE',
        candidateId: null,
      }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.markAppValidated).toHaveBeenCalledWith('p1', 'c-new')
  })

  it('relinks a processed AppProfile whose Candidate was recreated', async () => {
    const deps = stubValidatedDeps({
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'APP_VALIDATED',
        candidateId: null,
      }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.linkAppProfileCandidate).toHaveBeenCalledWith('p1', 'c-new')
    expect(deps.markAppValidated).not.toHaveBeenCalled()
  })

  it('leaves a processed AppProfile alone once it points at its Candidate', async () => {
    const deps = stubValidatedDeps({
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'IGNORE',
        candidateId: 'c-new',
      }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.linkAppProfileCandidate).not.toHaveBeenCalled()
    expect(deps.markAppValidated).not.toHaveBeenCalled()
  })

  it('skips recipient already linked by badakanId', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => existingLinked,
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'EN_ATTENTE',
        candidateId: null,
      }),
    })
    const result = await syncAppValidated([marieValidated], deps)
    expect(result).toEqual({ created: 0, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.linkAppOrigin).not.toHaveBeenCalled()
    expect(deps.markAppValidated).toHaveBeenCalledWith('p1', 'c-existing')
  })

  it('does not rewrite comments onto an already linked Candidate', async () => {
    const enrichFromComments = vi.fn()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findByBadakanId: async () => existingLinked,
        enrichFromComments,
      }),
    )
    expect(enrichFromComments).not.toHaveBeenCalled()
  })

  it('fills software and notes from Badakan comments on create', async () => {
    const deps = stubValidatedDeps({
      enrichFromComments: async () => ({
        notes: 'Logiciel LGPI.',
        softwareIds: ['sw-lgpi'],
        availableFrom: new Date('2026-09-15T00:00:00.000Z'),
      }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: 'APP',
        notes: 'Logiciel LGPI.',
        softwareIds: ['sw-lgpi'],
        availableFrom: new Date('2026-09-15T00:00:00.000Z'),
      }),
    )
  })

  it('uses the job title read from comments when Badakan has no activity', async () => {
    const deps = stubValidatedDeps({
      enrichFromComments: async () => ({ jobTitleId: 'jt-prepa' }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({ jobTitleId: 'jt-prepa' }),
    )
  })

  it('keeps the Badakan activity over the job title read from comments', async () => {
    const deps = stubValidatedDeps({
      mapJobTitleId: async () => 'jt-pharma',
      enrichFromComments: async () => ({ jobTitleId: 'jt-prepa' }),
    })
    await syncAppValidated([marieMoved], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({ jobTitleId: 'jt-pharma' }),
    )
  })
})
