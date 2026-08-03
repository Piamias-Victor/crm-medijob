'use client'

import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'
import type { GlobalSearchHit } from '@/server/search/global-search'

type Props = {
  hit: GlobalSearchHit
  icon: LucideIcon
  onNavigate: () => void
}

export function GlobalSearchHitLink({ hit, icon: Icon, onNavigate }: Props) {
  return (
    <Link
      href={hit.href}
      onClick={onNavigate}
      className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-primary-muted"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-surface text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-fg">{hit.label}</span>
        {hit.sublabel ? (
          <span className="block truncate text-xs text-fg-muted">{hit.sublabel}</span>
        ) : null}
      </span>
    </Link>
  )
}
