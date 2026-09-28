import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { syncAppValidated } from './sync-validated'
import { existingLinked, stubValidatedDeps } from './sync-validated.fixtures'

const notValid = mapBadakanRecipient({
  id: 'bk-marie',
  firstName: 'Marie',
  lastName: 'App',
  isValid: false,
})!

describe('syncAppValidated isValid gate', () => {
  it('does not create a CVthèque Candidate until Badakan isValid', async () => {
    const deps = stubValidatedDeps()
    const result = await syncAppValidated([notValid], deps)
    expect(result).toEqual({ created: 0, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.markAppValidated).not.toHaveBeenCalled()
    expect(deps.returnToInbox).not.toHaveBeenCalled()
    expect(deps.markBadakanValidated).not.toHaveBeenCalled()
  })

  it('stamps badakanValidatedAt when an existing Candidate becomes isValid', async () => {
    const valid = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      isValid: true,
    })!
    const deps = stubValidatedDeps({
      findByBadakanId: async () => existingLinked,
    })
    await syncAppValidated([valid], deps)
    expect(deps.markBadakanValidated).toHaveBeenCalledWith('c-existing')
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
  })

  it('still creates when listing says isValid true', async () => {
    const valid = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      isValid: true,
    })!
    const deps = stubValidatedDeps()
    await syncAppValidated([valid], deps)
    expect(deps.createAppCandidate).toHaveBeenCalled()
    expect(deps.markBadakanValidated).toHaveBeenCalledWith('c-new')
    expect(deps.returnToInbox).not.toHaveBeenCalled()
  })

  it('does not stamp badakanValidatedAt twice', async () => {
    const valid = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      isValid: true,
    })!
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({
        ...existingLinked,
        badakanValidatedAt: new Date('2026-01-01T00:00:00.000Z'),
      }),
    })
    await syncAppValidated([valid], deps)
    expect(deps.markBadakanValidated).not.toHaveBeenCalled()
  })

  it('keeps Entrées EN_ATTENTE when linked Candidate is not yet isValid', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => existingLinked,
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'EN_ATTENTE',
        candidateId: null,
      }),
    })
    await syncAppValidated([notValid], deps)
    expect(deps.markAppValidated).not.toHaveBeenCalled()
  })
})
