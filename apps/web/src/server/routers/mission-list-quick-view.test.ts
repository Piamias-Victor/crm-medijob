// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { makeMissionDeps, missionCaller } from '@/server/routers/mission.test.fixtures'

describe('missionRouter list + quickView', () => {
  it('list passe les filtres au repository', async () => {
    const deps = makeMissionDeps()
    await missionCaller(deps).list({ statuses: ['A_POURVOIR'], referentIds: ['u1'] })
    expect(deps.list).toHaveBeenCalledWith({
      statuses: ['A_POURVOIR'],
      referentIds: ['u1'],
    })
  })

  it('quickView mappe via view-model', async () => {
    const deps = makeMissionDeps({
      findQuickViewById: vi.fn().mockResolvedValue({
        id: 'm1',
        title: 'Titulaire',
        status: 'A_POURVOIR',
        contractType: 'CDI',
        jobTitle: { name: 'Pharmacien' },
        referent: { name: 'Réf' },
        pharmacy: {
          name: 'Pharma',
          address: null,
          postalCode: '69003',
          city: 'Lyon',
          phone: null,
        },
        lastActivity: null,
      }),
    })
    const view = await missionCaller(deps).quickView({ id: 'm1' })
    expect(view?.pharmacyName).toBe('Pharma')
    expect(view?.jobTitleName).toBe('Pharmacien')
  })
})
