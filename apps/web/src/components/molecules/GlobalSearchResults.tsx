'use client'

import { SearchX } from 'lucide-react'
import type { GlobalSearchResult } from '@/server/search/global-search'
import {
  GLOBAL_SEARCH_GROUP_LABELS,
  GLOBAL_SEARCH_GROUP_ORDER,
} from '@/lib/constants/global-search-labels'
import { GLOBAL_SEARCH_GROUP_ICONS } from '@/lib/constants/global-search-icons'
import { GlobalSearchGroup } from '@/components/molecules/GlobalSearchGroup'

type Props = {
  results: GlobalSearchResult | undefined
  isLoading: boolean
  isEmpty: boolean
  onNavigate: () => void
}

export function GlobalSearchResults({ results, isLoading, isEmpty, onNavigate }: Props) {
  if (isLoading) {
    return <p className="px-4 py-8 text-center text-sm text-fg-muted">Recherche…</p>
  }
  if (isEmpty || !results) {
    return (
      <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
        <SearchX className="size-5 text-fg-muted" aria-hidden />
        <p className="text-sm font-medium text-fg">Aucun résultat</p>
        <p className="text-xs text-fg-muted">Essaie un autre nom ou un autre terme.</p>
      </div>
    )
  }

  return (
    <div className="max-h-[min(24rem,50vh)] overflow-y-auto">
      {GLOBAL_SEARCH_GROUP_ORDER.map((key) => (
        <GlobalSearchGroup
          key={key}
          label={GLOBAL_SEARCH_GROUP_LABELS[key]}
          icon={GLOBAL_SEARCH_GROUP_ICONS[key]}
          hits={results[key]}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  )
}
