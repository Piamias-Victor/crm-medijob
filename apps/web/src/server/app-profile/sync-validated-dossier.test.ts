import { describe, expect, it, vi } from 'vitest'
import { syncAppValidated } from './sync-validated'
import { marieValidated, stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated dossier', () => {
  it('copies Badakan dossier onto created Candidate', async () => {
    const syncDossier = vi.fn()
    await syncAppValidated([marieValidated], stubValidatedDeps({ syncDossier }))
    expect(syncDossier).toHaveBeenCalledWith('c-new', 'bk-marie')
  })

  it('copies dossier onto existing and linked Candidates', async () => {
    const syncDossier = vi.fn()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findByBadakanId: async () => ({ id: 'c-existing' }),
        syncDossier,
      }),
    )
    expect(syncDossier).toHaveBeenCalledWith('c-existing', 'bk-marie')

    syncDossier.mockClear()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findMatch: async () => ({
          id: 'c-qualifie',
          firstName: 'Marie',
          lastName: 'App',
          email: 'marie@app.fr',
          phone: '0600000001',
        }),
        syncDossier,
      }),
    )
    expect(syncDossier).toHaveBeenCalledWith('c-qualifie', 'bk-marie')
  })
})
