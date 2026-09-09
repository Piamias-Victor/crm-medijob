// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { missionCaller, missionDeps } from './badakan-mission.test.fixtures'

describe('badakanMissionRouter listNeeds', () => {
  it('lists open staffing needs with job title and LGO', async () => {
    const listOpenNeeds = vi.fn().mockResolvedValue([
      {
        id: 'need1',
        pharmacyName: 'Pharmacie du Cygne',
        city: 'Strasbourg',
        postalCode: '67000',
        step: 'CREATED',
        activityLabel: 'Préparateur Expert',
        expectedRecipients: 2,
        staffedRecipients: 1,
        periods: [{ start: '2026-09-10', end: '2026-09-12' }],
        jobTitle: { name: 'Préparateur' },
        software: { name: 'LGPI' },
      },
    ])
    const items = await missionCaller(missionDeps({ listOpenNeeds })).listNeeds()
    expect(items).toEqual([
      expect.objectContaining({
        pharmacyName: 'Pharmacie du Cygne',
        jobTitleLabel: 'Préparateur',
        softwareLabel: 'LGPI',
        gapLabel: '1/2 pourvus',
        stepLabel: 'Créée',
        href: '/interim/missions/need1',
      }),
    ])
  })
})
