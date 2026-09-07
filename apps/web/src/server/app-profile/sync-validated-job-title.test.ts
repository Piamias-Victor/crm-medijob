import { describe, expect, it } from 'vitest'
import { mapBadakanRecipient } from '@/server/badakan/map-recipient'
import { jobTitleIdForAppCreate, jobTitleIdFromActivity } from './job-title-from-activity'
import { syncAppValidated } from './sync-validated'
import { stubValidatedDeps } from './sync-validated.fixtures'

describe('syncAppValidated job title', () => {
  it('creates Préparateur when Badakan activity is Préparateur Expert', async () => {
    const row = mapBadakanRecipient({
      id: 'bk-marie',
      firstName: 'Marie',
      lastName: 'App',
      activity: 'Préparateur Expert',
      isValid: true,
    })!
    const titles = [
      { id: 'jt-autre', name: 'Autre' },
      { id: 'jt-preparateur', name: 'Préparateur' },
    ]
    const deps = stubValidatedDeps({
      mapJobTitleId: async (label) => jobTitleIdFromActivity(label, titles),
      resolveJobTitleId: async (label) => jobTitleIdForAppCreate(label, titles),
    })
    await syncAppValidated([row], deps)
    expect(deps.createAppCandidate).toHaveBeenCalledWith(
      expect.objectContaining({ jobTitleId: 'jt-preparateur' }),
    )
  })
})
