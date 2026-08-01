import type { DashboardAlerts, DashboardOverview } from '@/view-models/home-overview'
import { candidatsPageHref } from '@/view-models/candidats-tab'

export type HomeAlertGroup = {
  key: keyof DashboardAlerts
  title: string
  empty: string
  href: string
  count: number
  items: DashboardAlerts[keyof DashboardAlerts]['items']
}

export function buildHomeAlertGroups(overview: DashboardOverview): HomeAlertGroup[] {
  const { alerts } = overview
  return [
    {
      key: 'uncoveredMissions',
      title: 'Missions non couvertes',
      empty: 'Aucune mission ouverte sans candidat.',
      href: '/missions',
      count: alerts.uncoveredMissions.count,
      items: alerts.uncoveredMissions.items,
    },
    {
      key: 'untreatedApplications',
      title: 'Candidatures non traitées',
      empty: 'Inbox à jour.',
      href: candidatsPageHref('inbox'),
      count: alerts.untreatedApplications.count,
      items: alerts.untreatedApplications.items,
    },
    {
      key: 'overdueFollowUps',
      title: 'Relances en retard',
      empty: 'Aucune relance en retard (seuil 7 j).',
      href: '/missions',
      count: alerts.overdueFollowUps.count,
      items: alerts.overdueFollowUps.items,
    },
  ]
}
