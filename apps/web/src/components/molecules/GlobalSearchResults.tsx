'use client'

import { SearchX } from 'lucide-react'
import type { GlobalSearchResult } from '@/server/search/global-search'
import {
  GLOBAL_SEARCH_GROUP_LABELS,
  GLOBAL_SEARCH_GROUP_ORDER,
} from '@/lib/constants/global-search-labels'
import { EmptyState } from '@/components/atoms/EmptyState'
import { GlobalSearchGroup } from '@/components/molecules/GlobalSearchGroup'

type Props = {
  results: GlobalSearchResult | undefined
  isLoading: boolean
  isEmpty: boolean
  onNavigate: () => void
}

export function GlobalSearchResults({ results, isLoading, isEmpty, onNavigate }: Props) {
  if (isLoading) {
    return <p className="px-3 py-2 text-xs text-fg-muted">Recherche…</p>
  }
  if (isEmpty || !results) {
    return (
      <div className="px-3 py-2">
        <EmptyState icon={SearchX} title="Aucun résultat" variant="compact" />
      </div>
    )
  }

  return (
    <div className="max-h-80 divide-y divide-border/60 overflow-y-auto">
      {GLOBAL_SEARCH_GROUP_ORDER.map((key) => (
        <GlobalSearchGroup
          key={key}
          label={GLOBAL_SEARCH_GROUP_LABELS[key]}
          hits={results[key]}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}
