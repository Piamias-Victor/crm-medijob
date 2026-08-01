import { describe, expect, it } from 'vitest'
import { buildHomeKpis } from './home-kpi'
import type { DashboardOverview } from './home-overview'

const overview: DashboardOverview = {
  candidates: 10,
  pharmacies: 5,
  missionsActive: 3,
  inboxPending: 2,
  missionsUrgent: 1,
  fillRate: 40,
  alerts: {
    uncoveredMissions: { count: 0, items: [] },
    untreatedApplications: { count: 0, items: [] },
    overdueFollowUps: { count: 0, items: [] },
  },
}

describe('buildHomeKpis', () => {
  it('maps CSV KPI bar from overview', () => {
    const kpis = buildHomeKpis(overview)
    expect(kpis).toHaveLength(4)
    expect(kpis[0]).toMatchObject({ label: 'À pourvoir', value: 3 })
    expect(kpis[1]).toMatchObject({ label: 'Urgentes', value: 1, accent: true })
    expect(kpis[2]).toMatchObject({
      label: 'Candidatures',
      href: '/candidats?tab=inbox',
      value: 2,
    })
    expect(kpis[3]).toMatchObject({ label: 'Remplissage', value: '40 %' })
  })
})
