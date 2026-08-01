import { describe, expect, it } from 'vitest'
import { makeDashboardRepository } from './dashboard.repository'
import { makeDashboardTestDb } from './dashboard.repository.test.fixtures'

const now = new Date('2026-08-01T12:00:00.000Z')

describe('makeDashboardRepository getOverview', () => {
  it('returns CSV KPI counts and fill rate', async () => {
    const overview = await makeDashboardRepository(makeDashboardTestDb()).getOverview(now)

    expect(overview).toMatchObject({
      candidates: 10,
      pharmacies: 5,
      missionsActive: 3,
      inboxPending: 2,
      missionsUrgent: 1,
      fillRate: 40,
    })
  })

  it('lists overdue follow-ups when last touch older than 7 days', async () => {
    const overview = await makeDashboardRepository(
      makeDashboardTestDb({
        openMissions: [
          {
            id: 'm-old',
            title: 'Pharmacien nuit',
            createdAt: new Date('2026-06-01T12:00:00.000Z'),
            activities: [],
          },
          {
            id: 'm-fresh',
            title: 'Préparateur',
            createdAt: new Date('2026-06-01T12:00:00.000Z'),
            activities: [{ date: new Date('2026-07-30T12:00:00.000Z') }],
          },
        ],
      }),
    ).getOverview(now)

    expect(overview.alerts.overdueFollowUps).toEqual({
      count: 1,
      items: [
        {
          id: 'm-old',
          label: 'Pharmacien nuit',
          href: '/missions/m-old',
        },
      ],
    })
  })

  it('lists uncovered open missions without candidates', async () => {
    const overview = await makeDashboardRepository(
      makeDashboardTestDb({
        uncovered: [{ id: 'm1', title: 'Titulaire CDD' }],
      }),
    ).getOverview(now)

    expect(overview.alerts.uncoveredMissions).toEqual({
      count: 1,
      items: [{ id: 'm1', label: 'Titulaire CDD', href: '/missions/m1' }],
    })
  })
})
