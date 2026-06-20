'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import { Briefcase, Building2, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import { pillNavLinkClass } from '@/view-models/pill-nav-link'
import type { DashboardOverview } from '@/view-models/home-overview'

type NavLink = {
  href: string
  label: string
  icon: LucideIcon
  badge?: (overview: DashboardOverview) => number
}

const LINKS: NavLink[] = [
  { href: '/missions', label: 'Missions', icon: Briefcase, badge: (o) => o.missionsActive },
  { href: '/candidats', label: 'Candidats', icon: Users, badge: (o) => o.inboxPending },
  { href: '/pharmacies', label: 'Pharmacies', icon: Building2 },
  { href: '/assistant', label: 'Assistant IA', icon: Sparkles },
]

type Props = { overview: DashboardOverview }

export function HomeNavPills({ overview }: Props) {
  return (
    <nav className="flex flex-wrap gap-2" aria-label="Raccourcis modules">
      {LINKS.map(({ href, label, icon: Icon, badge }) => {
        const count = badge?.(overview) ?? 0
        return (
          <Link
            key={href}
            href={href}
            className={cn(pillNavLinkClass(false), 'inline-flex items-center gap-2')}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            {label}
            {count > 0 ? (
              <span className="rounded-full bg-accent-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-accent-hover">
                {count}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
