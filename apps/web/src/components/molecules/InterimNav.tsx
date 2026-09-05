'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { interimNavItems } from '@/view-models/interim-nav-items'

export type InterimNavCounts = {
  besoins: number
  dispos: number
  suivi: number
}

type Props = { counts?: InterimNavCounts }

function isActive(pathname: string, href: string) {
  if (href === '/interim') return pathname === '/interim'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function badgeFor(href: string, counts?: InterimNavCounts): number | null {
  if (!counts) return null
  if (href === '/interim/besoins') return counts.besoins
  if (href === '/interim/disponibilites') return counts.dispos
  if (href === '/interim/suivi') return counts.suivi
  return null
}

export function InterimNav({ counts }: Props) {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Sections intérim"
      className="flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-xl border border-border/60 bg-white p-1"
    >
      {interimNavItems().map((item) => {
        const active = isActive(pathname, item.href)
        const Icon = item.icon
        const badge = badgeFor(item.href, counts)
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors',
              active ? 'text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {active ? (
              <motion.span
                layoutId="interim-nav-pill"
                className="absolute inset-0 rounded-lg bg-accent"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            ) : null}
            <Icon className="relative size-3.5 shrink-0" aria-hidden />
            <span className="relative">{item.label}</span>
            {badge != null ? (
              <span
                className={cn(
                  'relative rounded-md px-1 py-0.5 text-[10px] font-bold tabular-nums',
                  active ? 'bg-white/20' : 'bg-accent-muted text-accent',
                )}
              >
                {badge}
              </span>
            ) : null}
          </Link>
        )
      })}
    </nav>
  )
}
