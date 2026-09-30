import { describe, expect, it } from 'vitest'
import { visibleNavItems, navItems } from '@/lib/navigation'
import { canViewActivity } from '@/server/auth/can-view-activity'
import { resolveActivitePeriod } from '@/view-models/activite-period'
import { buildHomeKpis } from '@/view-models/home-kpi'
import type { DashboardOverview } from '@/view-models/home-overview'

describe('Activité e2e-style gates', () => {
  it('denies Activité nav for Recruteur / Communication', () => {
    expect(canViewActivity('RECRUTEUR')).toBe(false)
    expect(visibleNavItems('RECRUTEUR').some((i) => i.href === '/activite')).toBe(false)
    expect(visibleNavItems('COMMUNICATION').some((i) => i.href === '/activite')).toBe(false)
  })

  it('places Activité before Facturation for Direction', () => {
    const hrefs = visibleNavItems('DIRECTION').map((i) => i.href)
    expect(hrefs.indexOf('/activite')).toBe(hrefs.indexOf('/facturation') - 1)
    expect(navItems.map((i) => i.href).indexOf('/activite')).toBe(
      navItems.map((i) => i.href).indexOf('/facturation') - 1,
    )
  })

  it('changes period bounds when from/to change', () => {
    const a = resolveActivitePeriod({ from: '2026-03-01', to: '2026-03-07' })
    const b = resolveActivitePeriod({ from: '2026-04-01', to: '2026-04-07' })
    expect(a.fromYmd).not.toBe(b.fromYmd)
    expect(a.toExclusive.getTime()).not.toBe(b.toExclusive.getTime())
  })

  it('keeps Accueil KPI builder shape unchanged', () => {
    const overview: DashboardOverview = {
      candidates: 1,
      pharmacies: 1,
      missionsActive: 2,
      inboxPending: 3,
      missionsUrgent: 0,
      fillRate: 50,
      alerts: {
        uncoveredMissions: { count: 0, items: [] },
        untreatedApplications: { count: 0, items: [] },
        overdueFollowUps: { count: 0, items: [] },
      },
    }
    expect(buildHomeKpis(overview).map((k) => k.label)).toEqual([
      'À pourvoir',
      'Urgentes',
      'Candidatures',
      'Remplissage',
    ])
  })
})
