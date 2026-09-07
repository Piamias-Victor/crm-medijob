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
  it('creates a CVthèque Candidate when Badakan isValid is false', async () => {
    const deps = stubValidatedDeps()
    const result = await syncAppValidated([notValid], deps)
    expect(result).toEqual({ created: 1, linked: 0, skipped: 0 })
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Marie',
        lastName: 'App',
        origin: 'APP',
        badakanId: 'bk-marie',
      }),
    )
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.not.objectContaining({ badakanValidatedAt: expect.anything() }),
    )
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
})
