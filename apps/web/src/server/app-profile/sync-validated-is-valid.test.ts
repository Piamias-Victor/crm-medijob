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
  it('does not create a Candidate when Badakan isValid is false', async () => {
    const deps = stubValidatedDeps()
    const result = await syncAppValidated([notValid], deps)
    expect(result).toEqual({ created: 0, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.returnToInbox).toHaveBeenCalledWith(notValid, null)
  })

  it('sends an origin App Candidate back to Profils app when no longer valid', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => existingLinked,
    })
    await syncAppValidated([notValid], deps)
    expect(deps.returnToInbox).toHaveBeenCalledWith(notValid, existingLinked)
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.patchIdentity).not.toHaveBeenCalled()
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
    expect(deps.returnToInbox).not.toHaveBeenCalled()
  })
})
