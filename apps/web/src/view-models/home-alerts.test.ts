import { describe, expect, it } from 'vitest'
import { buildHomeAlertGroups } from './home-alerts'
import type { DashboardOverview } from './home-overview'

describe('buildHomeAlertGroups', () => {
  it('exposes three alert groups with items', () => {
    const overview: DashboardOverview = {
      candidates: 0,
      pharmacies: 0,
      missionsActive: 0,
      inboxPending: 1,
      missionsUrgent: 0,
      fillRate: 0,
      alerts: {
        uncoveredMissions: {
          count: 1,
          items: [{ id: 'm1', label: 'Titulaire', href: '/missions/m1' }],
        },
        untreatedApplications: {
          count: 1,
          items: [{ id: 'a1', label: 'Léa Bernard', href: '/candidats?tab=inbox' }],
        },
        overdueFollowUps: { count: 0, items: [] },
      },
    }

    const groups = buildHomeAlertGroups(overview)
    expect(groups).toHaveLength(3)
    expect(groups[0]?.count).toBe(1)
    expect(groups[1]?.href).toBe('/candidats?tab=inbox')
    expect(groups[2]?.title).toContain('Relances')
  })
})
