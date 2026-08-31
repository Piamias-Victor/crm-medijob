import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { syncAppValidated } from './sync-validated'
import { stubValidatedDeps } from './sync-validated.fixtures'

function marieWithStatus(status: 'SUSPENDED' | 'BANNED' | 'COMPLETED') {
  return mapBadakanRecipient({
    id: 'bk-marie',
    firstName: 'Marie',
    lastName: 'App',
    status,
  })!
}

function linked(status: 'QUALIFIE' | 'BLACKLISTE' | 'INACTIF', previous: 'QUALIFIE' | null = null) {
  return {
    id: 'c-marie' as const,
    status,
    statusBeforeInactive: previous,
  }
}

describe('syncAppValidated SUSPENDED/BANNED', () => {
  it('sets linked Candidate Inactif and remembers previous status', async () => {
    const applyLifecycle = vi.fn()
    const deps = stubValidatedDeps({
      findByBadakanId: async () => linked('QUALIFIE'),
      applyLifecycle,
    })
    await syncAppValidated([marieWithStatus('SUSPENDED')], deps)
    expect(applyLifecycle).toHaveBeenCalledWith('c-marie', {
      status: 'INACTIF',
      statusBeforeInactive: 'QUALIFIE',
    })
    expect(applyLifecycle).not.toHaveBeenCalledWith(
      'c-marie',
      expect.objectContaining({ status: 'BLACKLISTE' }),
    )
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
  })

  it('sets Inactif on BANNED the same way', async () => {
    const applyLifecycle = vi.fn()
    await syncAppValidated(
      [marieWithStatus('BANNED')],
      stubValidatedDeps({
        findByBadakanId: async () => linked('QUALIFIE'),
        applyLifecycle,
      }),
    )
    expect(applyLifecycle).toHaveBeenCalledWith('c-marie', {
      status: 'INACTIF',
      statusBeforeInactive: 'QUALIFIE',
    })
  })

  it('leaves Blacklisté unchanged when Badakan reports SUSPENDED', async () => {
    const applyLifecycle = vi.fn()
    await syncAppValidated(
      [marieWithStatus('SUSPENDED')],
      stubValidatedDeps({
        findByBadakanId: async () => linked('BLACKLISTE'),
        applyLifecycle,
      }),
    )
    expect(applyLifecycle).not.toHaveBeenCalled()
  })

  it('does not create a Candidate from SUSPENDED with no link', async () => {
    const deps = stubValidatedDeps()
    await syncAppValidated([marieWithStatus('SUSPENDED')], deps)
    expect(deps.createAppCandidate).not.toHaveBeenCalled()
    expect(deps.applyLifecycle).not.toHaveBeenCalled()
  })

  it('keeps remembered status when already Inactif', async () => {
    const applyLifecycle = vi.fn()
    await syncAppValidated(
      [marieWithStatus('SUSPENDED')],
      stubValidatedDeps({
        findByBadakanId: async () => linked('INACTIF', 'QUALIFIE'),
        applyLifecycle,
      }),
    )
    expect(applyLifecycle).not.toHaveBeenCalled()
  })
})
