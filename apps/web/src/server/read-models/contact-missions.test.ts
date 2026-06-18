import { describe, it, expect } from 'vitest'
import { toContactMissionRows } from '@/view-models/contact-detail'
import { listContactMissions } from '@/server/read-models/contact-missions'

describe('listContactMissions', () => {
  it('loads missions via mission read-model', async () => {
    const missions = [{ id: 'm1', title: 'CDI', status: 'A_POURVOIR' as const, pharmacy: { name: 'P' } }]
    const rows = await listContactMissions('c1', {
      listByContact: async () => missions,
    })
    expect(toContactMissionRows(missions)).toEqual(rows)
  })
})
