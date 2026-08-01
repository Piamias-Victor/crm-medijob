import { AlertTriangle, Briefcase, Inbox, Percent } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { candidatsPageHref } from '@/view-models/candidats-tab'
import type { DashboardOverview } from '@/view-models/home-overview'

export type HomeKpiDef = {
  href: string
  label: string
  caption: string
  value: number | string
  icon: LucideIcon
  accent?: boolean
}

export function buildHomeKpis(overview: DashboardOverview): HomeKpiDef[] {
  return [
    {
      href: '/missions',
      label: 'À pourvoir',
      caption: 'Missions ouvertes',
      value: overview.missionsActive,
      icon: Briefcase,
      accent: true,
    },
    {
      href: '/missions',
      label: 'Urgentes',
      caption: '< 48 h',
      value: overview.missionsUrgent,
      icon: AlertTriangle,
      accent: overview.missionsUrgent > 0,
    },
    {
      href: candidatsPageHref('inbox'),
      label: 'Candidatures',
      caption: 'À traiter',
      value: overview.inboxPending,
      icon: Inbox,
      accent: overview.inboxPending > 0,
    },
    {
      href: '/missions',
      label: 'Remplissage',
      caption: 'Taux global',
      value: `${overview.fillRate} %`,
      icon: Percent,
    },
  ]
}
