import { describe, expect, it } from 'vitest'
import { syncAppValidated } from './sync-validated'
import {
  existingLinked,
  mariePending,
  stubValidatedDeps,
} from './sync-validated.fixtures'

describe('syncAppValidated isValid gate', () => {
  it('keeps Entrées app row when Badakan is not yet validated', async () => {
    const deps = stubValidatedDeps({
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'EN_ATTENTE',
        candidateId: null,
      }),
      mapJobTitleId: async () => 'jt1',
    })
    const result = await syncAppValidated([mariePending], deps)
    expect(result).toEqual({ created: 0, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.markAppValidated).not.toHaveBeenCalled()
  })

  it('does not mark App-validated on linked Candidate until Badakan isValid', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async () => existingLinked,
      findAppProfileByBadakanId: async () => ({
        id: 'p1',
        status: 'EN_ATTENTE',
        candidateId: null,
      }),
    })
    await syncAppValidated([mariePending], deps)
    expect(deps.markAppValidated).not.toHaveBeenCalled()
    expect(deps.linkAppProfileCandidate).not.toHaveBeenCalled()
  })
})
