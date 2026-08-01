'use client'

import type { LucideIcon } from 'lucide-react'
import type { GlobalSearchHit } from '@/server/search/global-search'
import { GlobalSearchHitLink } from '@/components/molecules/GlobalSearchHitLink'

type Props = {
  label: string
  icon: LucideIcon
  hits: GlobalSearchHit[]
  onNavigate: () => void
}

export function GlobalSearchGroup({ label, icon, hits, onNavigate }: Props) {
  if (hits.length === 0) return null

  return (
    <section className="py-1">
      <h3 className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </h3>
      <ul>
        {hits.map((hit) => (
          <li key={`${label}-${hit.id}`}>
            <GlobalSearchHitLink hit={hit} icon={icon} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </section>
  )
}
