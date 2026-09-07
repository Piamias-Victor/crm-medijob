import { describe, expect, it, vi } from 'vitest'
import { syncAppValidated } from './sync-validated'
import { marieValidated, stubValidatedDeps, existingLinked } from './sync-validated.fixtures'

describe('syncAppValidated dossier', () => {
  it('copies Badakan dossier onto created Candidate', async () => {
    const syncDossier = vi.fn()
    await syncAppValidated([marieValidated], stubValidatedDeps({ syncDossier }))
    expect(syncDossier).toHaveBeenCalledWith('c-new', 'bk-marie')
  })

  it('does not refetch dossier for a Candidate already linked by badakanId', async () => {
    const syncDossier = vi.fn()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findByBadakanId: async () => existingLinked,
        syncDossier,
      }),
    )
    expect(syncDossier).not.toHaveBeenCalled()
  })

  it('copies dossier onto first email-link Candidate', async () => {
    const syncDossier = vi.fn()
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
