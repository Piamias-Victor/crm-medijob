import { describe, expect, it, vi } from 'vitest'
import { syncAppValidated } from './sync-validated'
import { existingLinked, marieMoved, marieValidated, stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated comments', () => {
  it('does not rewrite comments onto an already linked Candidate', async () => {
    const enrichFromComments = vi.fn()
    await syncAppValidated(
      [marieValidated],
      stubValidatedDeps({
        findByBadakanId: async () => existingLinked,
        enrichFromComments,
      }),
    )
    expect(enrichFromComments).not.toHaveBeenCalled()
  })

  it('fills software and notes from Badakan comments on create', async () => {
    const deps = stubValidatedDeps({
      mapJobTitleId: async () => null,
      resolveJobTitleId: async () => null,
      enrichFromComments: async () => ({
        jobTitleId: 'jt1',
        notes: 'Logiciel LGPI.',
        softwareIds: ['sw-lgpi'],
        availableFrom: new Date('2026-09-15T00:00:00.000Z'),
      }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({
        origin: 'APP',
        notes: 'Logiciel LGPI.',
        softwareIds: ['sw-lgpi'],
        availableFrom: new Date('2026-09-15T00:00:00.000Z'),
      }),
    )
  })

  it('does not fetch comments when a métier already resolves', async () => {
    const enrichFromComments = vi.fn()
    const deps = stubValidatedDeps({ enrichFromComments })
    await syncAppValidated([marieValidated], deps)
    expect(enrichFromComments).not.toHaveBeenCalled()
    expect(deps.createAppCandidate).toHaveBeenCalled()
  })

  it('uses the job title read from comments when Badakan has no activity', async () => {
    const deps = stubValidatedDeps({
      mapJobTitleId: async () => null,
      resolveJobTitleId: async () => null,
      enrichFromComments: async () => ({ jobTitleId: 'jt-prepa' }),
    })
    await syncAppValidated([marieValidated], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({ jobTitleId: 'jt-prepa' }),
    )
  })

  it('keeps the Badakan activity over the job title read from comments', async () => {
    const deps = stubValidatedDeps({
      mapJobTitleId: async () => 'jt-pharma',
      enrichFromComments: async () => ({ jobTitleId: 'jt-prepa' }),
    })
    await syncAppValidated([marieMoved], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({ jobTitleId: 'jt-pharma' }),
    )
  })
})
