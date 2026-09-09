import { describe, expect, it } from 'vitest'
import { makeBadakanMissionRepository } from './badakan-mission.repository'
import { mockMissionDb } from './badakan-mission.repository.fixtures'

describe('badakanMissionRepository listOpenNeeds', () => {
  it('lists only missions that still need staffing', async () => {
    const db = mockMissionDb()
    db.badakanMission.findMany.mockResolvedValue([
      {
        id: 'open',
        pharmacyName: 'Cygne',
        city: 'Strasbourg',
        activityLabel: 'Préparateur Expert',
        expectedRecipients: 2,
        staffedRecipients: 1,
        periods: [],
        jobTitle: { name: 'Préparateur' },
        software: { name: 'LGPI' },
      },
      {
        id: 'full',
        pharmacyName: 'Hermes',
        city: 'Lyon',
        activityLabel: 'Pharmacien',
        expectedRecipients: 1,
        staffedRecipients: 1,
        periods: [],
        jobTitle: null,
        software: null,
      },
    ])
    const repo = makeBadakanMissionRepository(db as never)
    const rows = await repo.listOpenNeeds(10)
    expect(rows.map((row) => row.id)).toEqual(['open'])
    expect(db.badakanMission.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: {
          jobTitle: { select: { name: true } },
          software: { select: { name: true } },
          proposals: { select: { status: true } },
        },
      }),
    )
  })
})
