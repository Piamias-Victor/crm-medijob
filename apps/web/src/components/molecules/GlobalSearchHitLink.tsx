'use client'

import Link from 'next/link'
import type { GlobalSearchHit } from '@/server/search/global-search'

type Props = {
  hit: GlobalSearchHit
  onNavigate: () => void
}

export function GlobalSearchHitLink({ hit, onNavigate }: Props) {
  return (
    <Link
      href={hit.href}
      onClick={onNavigate}
      className="flex w-full flex-col items-start px-3 py-2 text-left transition-colors hover:bg-accent-muted/40"
    >
      <span className="text-sm font-medium text-fg">{hit.label}</span>
      {hit.sublabel ? <span className="text-xs text-fg-muted">{hit.sublabel}</span> : null}
    </Link>
  )
}
