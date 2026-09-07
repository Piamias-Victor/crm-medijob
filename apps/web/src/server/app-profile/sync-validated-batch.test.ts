import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { syncAppValidated } from './sync-validated'
import { stubValidatedDeps, existingLinked } from './sync-validated.fixtures'

function person(id: string) {
  return mapBadakanRecipient({
    id,
    firstName: id,
    lastName: 'App',
  })!
}

describe('syncAppValidated convert cap', () => {
  it('creates only up to the heavy-work limit per run', async () => {
    const deps = stubValidatedDeps()
    const result = await syncAppValidated(
      [person('bk-1'), person('bk-2'), person('bk-3')],
      deps,
      1,
    )
    expect(result).toEqual({ created: 1, linked: 0, skipped: 2 })
    expect(deps.createAppCandidate).toHaveBeenCalledTimes(1)
  })

  it('does not spend the cap on an already-linked Candidate', async () => {
    const deps = stubValidatedDeps({
      findByBadakanId: async (id) => (id === 'bk-marie' ? existingLinked : null),
    })
    const result = await syncAppValidated(
      [person('bk-marie'), person('bk-new')],
      deps,
      1,
    )
    expect(result).toEqual({ created: 1, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).toHaveBeenCalledTimes(1)
  })
})
