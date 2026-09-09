import { describe, expect, it, vi } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { jobTitleIdFromActivity } from './job-title-from-activity'
import { syncAppValidated } from './sync-validated'
import { existingLinked, stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated job title merge', () => {
  it('realigns CRM job when Badakan later says Pharmacien Expert', async () => {
    const expert = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      activity: 'Pharmacien Expert',
      isValid: true,
    })!
    const deps = stubValidatedDeps({
      findByBadakanId: async () => existingLinked,
      mapJobTitleId: async (label) =>
        jobTitleIdFromActivity(label, [
          { id: 'jt-autre', name: 'Autre' },
          { id: 'jt-pharmacien', name: 'Pharmacien' },
        ]),
    })
    await syncAppValidated([expert], deps)
    expect(vi.mocked(deps.patchIdentity).mock.calls[0]?.[1]).toMatchObject({
      jobTitleId: 'jt-pharmacien',
    })
  })

  it('replaces Autre with the mapped Badakan métier', async () => {
    const expert = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      activity: 'Pharmacien Expert',
      isValid: true,
    })!
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({
        ...existingLinked,
        jobTitleId: 'jt-autre',
        jobTitleName: 'Autre',
      }),
      mapJobTitleId: async (label) =>
        jobTitleIdFromActivity(label, [
          { id: 'jt-autre', name: 'Autre' },
          { id: 'jt-pharmacien', name: 'Pharmacien' },
        ]),
    })
    await syncAppValidated([expert], deps)
    expect(vi.mocked(deps.patchIdentity).mock.calls[0]?.[1]).toMatchObject({
      jobTitleId: 'jt-pharmacien',
    })
  })

  it('does not overwrite a real CRM métier with Badakan', async () => {
    const preparateur = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      activity: 'Préparateur',
      isValid: true,
    })!
    const deps = stubValidatedDeps({
      findByBadakanId: async () => ({
        ...existingLinked,
        jobTitleId: 'jt-pharmacien',
        jobTitleName: 'Pharmacien',
      }),
      mapJobTitleId: async () => 'jt-preparateur',
    })
    await syncAppValidated([preparateur], deps)
    const patch = vi.mocked(deps.patchIdentity).mock.calls[0]?.[1]
    expect(patch).not.toHaveProperty('jobTitleId')
  })
})
