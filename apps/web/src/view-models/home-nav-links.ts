import type { LucideIcon } from 'lucide-react'
import { Briefcase, Building2, Sparkles, Users } from 'lucide-react'
import { candidatsNavHref } from '@/view-models/candidats-tab'

export type HomeNavLink = {
  href: string
  label: string
  icon: LucideIcon
  badge?: number
}

export function buildHomeNavLinks(overview: {
  missionsActive: number
  inboxPending: number
}): HomeNavLink[] {
  return [
    { href: '/missions', label: 'Missions', icon: Briefcase, badge: overview.missionsActive },
    {
      href: candidatsNavHref(overview.inboxPending),
      label: 'Candidats',
      icon: Users,
      badge: overview.inboxPending,
    },
    { href: '/pharmacies', label: 'Pharmacies', icon: Building2 },
    { href: '/assistant', label: 'Assistant IA', icon: Sparkles },
  ]
}
