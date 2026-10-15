import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { syncAppValidated } from './sync-validated'
import { marieValidated, stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated badakanId unique', () => {
  it('skips a badakanId unique conflict and continues the batch', async () => {
    const other = mapBadakanRecipient({
      id: 'bk-leo',
      firstName: 'Leo',
      lastName: 'App',
      email: 'leo@app.fr',
      phone: '0600000002',
      isValid: true,
    })!
    const deps = stubValidatedDeps({
      findMatch: async ({ email }) =>
        email === 'marie@app.fr'
          ? {
              id: 'c-qualifie',
              firstName: 'Marie',
              lastName: 'App',
              email: 'marie@app.fr',
              phone: '0600000001',
            }
          : null,
      linkAppOrigin: vi.fn().mockRejectedValue({ code: 'P2002' }),
    })
    const result = await syncAppValidated([marieValidated, other], deps)
    expect(result).toEqual({ created: 1, linked: 0, skipped: 1 })
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({ badakanId: 'bk-leo' }),
    )
  })
})
