'use client'

import { Search } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useGlobalSearchStore } from '@/stores/global-search-store'

type Props = { expanded?: boolean }

export function GlobalSearchTrigger({ expanded = true }: Props) {
  const openPalette = useGlobalSearchStore((s) => s.openPalette)

  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Recherche globale"
      title="Recherche globale (⌘K)"
      className={cn(
        'flex h-9 w-full items-center rounded-md text-sm font-medium text-fg-muted transition-colors hover:bg-surface hover:text-fg',
        expanded ? 'gap-3 px-3' : 'justify-center px-0',
      )}
    >
      <Search className="size-5 shrink-0" />
      {expanded ? (
        <>
          <span className="truncate">Rechercher</span>
          <kbd className="ml-auto rounded border border-border px-1.5 py-0.5 text-[10px] text-fg-muted">
            ⌘K
          </kbd>
        </>
      ) : null}
    </button>
  )
}
