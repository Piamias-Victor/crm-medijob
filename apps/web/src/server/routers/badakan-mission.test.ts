// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeBadakanMissionRouter } from './badakan-mission'
import { missionCaller, missionDeps } from './badakan-mission.test.fixtures'

describe('badakanMissionRouter', () => {
  it('lists Badakan missions with pharmacy, dates and step', async () => {
    const items = await missionCaller().list()
    expect(items).toEqual([
      expect.objectContaining({
        pharmacyName: 'Pharmacie Hermes',
        stepLabel: 'Annulée',
        href: '/interim/missions/row1',
      }),
    ])
  })

  it('returns SEARCH_APPLIED recipients with phone on detail', async () => {
    const detail = await missionCaller().getById({ id: 'row1' })
    expect(detail).toMatchObject({
      sectionTitle: 'Candidats ayant postulé',
      searchApplied: [
        {
          fullName: 'Lucie Robert',
          phone: '0601020304',
          telHref: 'tel:0601020304',
        },
      ],
    })
  })

  it('rejects unauthenticated reads', async () => {
    const unauth = createCallerFactory(makeBadakanMissionRouter(missionDeps()))({ session: null })
    await expect(unauth.list()).rejects.toMatchObject({ code: 'UNAUTHORIZED' })
  })
})
