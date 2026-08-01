'use client'

import type { GlobalSearchHit } from '@/server/search/global-search'
import { GlobalSearchHitLink } from '@/components/molecules/GlobalSearchHitLink'

type Props = {
  label: string
  hits: GlobalSearchHit[]
  onNavigate: () => void
}

export function GlobalSearchGroup({ label, hits, onNavigate }: Props) {
  if (hits.length === 0) return null

  return (
    <section>
      <h3 className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {label}
      </h3>
      <ul>
        {hits.map((hit) => (
          <li key={`${label}-${hit.id}`}>
            <GlobalSearchHitLink hit={hit} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </section>
  )
}
