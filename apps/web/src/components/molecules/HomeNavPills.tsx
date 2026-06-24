'use client'

import Link from 'next/link'
import { cn } from '@/lib/cn'
import { pillNavLinkClass } from '@/view-models/pill-nav-link'
import { buildHomeNavLinks } from '@/view-models/home-nav-links'
import type { DashboardOverview } from '@/view-models/home-overview'

type Props = { overview: DashboardOverview }

export function HomeNavPills({ overview }: Props) {
  const links = buildHomeNavLinks(overview)

  return (
    <nav className="flex flex-wrap gap-2" aria-label="Raccourcis modules">
      {links.map(({ href, label, icon: Icon, badge }) => (
        <Link
          key={href + label}
          href={href}
          className={cn(pillNavLinkClass(false), 'inline-flex items-center gap-2')}
        >
          <Icon className="size-4 shrink-0" aria-hidden />
          {label}
          {badge && badge > 0 ? (
            <span className="rounded-full bg-accent-muted px-2 py-0.5 text-xs font-semibold tabular-nums text-accent-hover">
              {badge}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  )
}
