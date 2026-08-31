import { describe, expect, it, vi } from 'vitest'
import { marieValidated, stubValidatedDeps } from './sync-validated.fixtures'
import { syncAppValidated } from './sync-validated'

describe('syncAppValidated restore COMPLETED', () => {
  it('restores previous status and does not create a second Candidate', async () => {
    const applyLifecycle = vi.fn()
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({
        id: 'c-marie',
        status: 'INACTIF',
        statusBeforeInactive: 'QUALIFIE',
      }),
      applyLifecycle,
    })
    await syncAppValidated([marieValidated], deps)
    expect(applyLifecycle).toHaveBeenCalledWith('c-marie', {
      status: 'QUALIFIE',
      statusBeforeInactive: null,
    })
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
  })

  it('does not restore manual Inactif without a remembered status', async () => {
    const applyLifecycle = vi.fn()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findByBadakanId: async () => ({
          id: 'c-marie',
          status: 'INACTIF',
          statusBeforeInactive: null,
        }),
        applyLifecycle,
      }),
    )
    expect(applyLifecycle).not.toHaveBeenCalled()
  })

  it('does not restore Blacklisté when Badakan reports COMPLETED', async () => {
    const applyLifecycle = vi.fn()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findByBadakanId: async () => ({
          id: 'c-marie',
          status: 'BLACKLISTE',
          statusBeforeInactive: 'QUALIFIE',
        }),
        applyLifecycle,
      }),
    )
    expect(applyLifecycle).not.toHaveBeenCalled()
  })
})
